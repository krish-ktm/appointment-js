import { TimeSlot } from './types';
import { supabase } from './lib/supabase';
import { startOfToday, addDays, format, parse, isToday, isTomorrow, isAfter, isBefore, isSunday } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

// Helper function to convert 24h time to 12h format
const to12HourFormat = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper function to convert 12h time to 24h format
const to24HourFormat = (time12: string): string => {
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);
  
  if (period.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

export const generateTimeSlots = async (date: string): Promise<TimeSlot[]> => {
  try {
    // Get working hours for the selected date
    const selectedDate = utcToZonedTime(new Date(date), TIMEZONE);
    const dayName = format(selectedDate, 'EEEE');

    const { data: workingHours, error } = await supabase
      .from('working_hours')
      .select('*')
      .eq('day', dayName)
      .single();

    if (error) throw error;
    if (!workingHours || !workingHours.is_working) {
      return [];
    }

    // Get current time in IST
    const istNow = utcToZonedTime(new Date(), TIMEZONE);
    
    // Parse and convert selected date to IST
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    const selectedDateInIST = utcToZonedTime(parsedDate, TIMEZONE);
    
    // Check if selected date is today or tomorrow
    const isSelectedToday = isToday(selectedDateInIST);
    const isSelectedTomorrow = isTomorrow(selectedDateInIST);
    const isSelectedSunday = isSunday(selectedDateInIST);

    // If it's Sunday, return empty array as clinic is closed
    if (isSelectedSunday) {
      return [];
    }

    // Convert slots from database to TimeSlot array and convert times to 12h format
    let slots: TimeSlot[] = (workingHours.slots || []).map(slot => ({
      ...slot,
      time: to12HourFormat(slot.time)
    }));

    // Get current bookings for each time slot
    const { data: bookings, error: bookingsError } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .eq('status', 'pending');

    if (bookingsError) throw bookingsError;

    // Count bookings for each time slot (convert booking times to 12h format for comparison)
    const bookingCounts = (bookings || []).reduce((acc, booking) => {
      const time12h = to12HourFormat(booking.appointment_time);
      acc[time12h] = (acc[time12h] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Update slots with current bookings and apply time restrictions
    slots = slots.map(slot => ({
      time: slot.time,
      maxBookings: slot.maxBookings,
      currentBookings: bookingCounts[slot.time] || 0
    }));

    if (isSelectedToday) {
      slots = slots.filter(slot => {
        // Convert 12h time back to 24h for comparison
        const time24h = to24HourFormat(slot.time);
        // Combine date and time for accurate comparison
        const slotDateTime = parse(`${date} ${time24h}`, 'yyyy-MM-dd HH:mm', new Date());
        const slotTimeInIST = utcToZonedTime(slotDateTime, TIMEZONE);
        
        // Block past time slots
        if (isBefore(slotTimeInIST, istNow)) {
          return false;
        }

        // Rule 1: At 9 AM IST, block all morning slots (9:30 AM to 12 PM)
        if (istNow.getHours() >= 9 && slotTimeInIST.getHours() < 12) {
          return false;
        }

        // Rule 2: At 1 PM IST, block all evening slots (4 PM to 6:30 PM)
        if (istNow.getHours() >= 13) {
          return false;
        }

        return true;
      });
    }

    return slots;
  } catch (error) {
    console.error('Error generating time slots:', error);
    return [];
  }
};

export const validateBookingRequest = async (
  phone: string,
  date: string,
  timeSlot: string
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    // Parse and convert to IST
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    const selectedDate = utcToZonedTime(parsedDate, TIMEZONE);
    const dayName = format(selectedDate, 'EEEE');

    // Check if the clinic is working on this day
    const { data: workingHours, error: workingHoursError } = await supabase
      .from('working_hours')
      .select('is_working, slots')
      .eq('day', dayName)
      .single();

    if (workingHoursError) throw workingHoursError;

    if (!workingHours || !workingHours.is_working) {
      return { isValid: false, error: 'The clinic is closed on this day' };
    }

    // Check if it's Sunday
    if (isSunday(selectedDate)) {
      return { isValid: false, error: 'Appointments are not available on Sundays' };
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
    }

    // Convert input time slot to 24h format for comparison
    const timeSlot24h = to24HourFormat(timeSlot);

    // Check if the selected time slot exists and has available bookings
    const slots = workingHours.slots || [];
    const selectedSlot = slots.find(slot => slot.time === timeSlot24h);
    
    if (!selectedSlot) {
      return { isValid: false, error: 'Invalid time slot selected' };
    }

    // Get current bookings for this slot
    const { data: bookings, error: bookingsError } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', date)
      .eq('appointment_time', timeSlot24h)
      .eq('status', 'pending');

    if (bookingsError) throw bookingsError;

    if (bookings && bookings.length >= selectedSlot.maxBookings) {
      return { isValid: false, error: 'This time slot is fully booked' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error in validateBookingRequest:', error);
    return { isValid: false, error: 'An unexpected error occurred. Please try again later' };
  }
};
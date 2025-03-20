import { TimeSlot } from './types';
import { supabase } from './lib/supabase';
import { startOfToday, addDays, format, parse, isToday, isTomorrow, isAfter, isBefore, isSunday } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

// Helper function to convert 24h time to 12h format
const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minutes} ${period}`;
};

// Helper function to convert 12h time to 24h format
const convertTo24Hour = (time12: string): string => {
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
    // Parse and convert to IST
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    const selectedDate = utcToZonedTime(parsedDate, TIMEZONE);
    const dayName = format(selectedDate, 'EEEE');
    const istNow = utcToZonedTime(new Date(), TIMEZONE);

    // Get working hours for the selected day
    const { data: workingHours, error: workingHoursError } = await supabase
      .from('working_hours')
      .select('*')
      .eq('day', dayName)
      .single();

    if (workingHoursError) throw workingHoursError;

    // If not a working day, return empty array
    if (!workingHours || !workingHours.is_working) {
      return [];
    }

    // Get available time slots
    const { data: timeSlots, error: timeSlotsError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('is_available', true)
      .order('time');

    if (timeSlotsError) throw timeSlotsError;

    // Filter slots based on working hours
    const slots = timeSlots?.filter(slot => {
      const slotTime = slot.time;
      
      // Check if slot is within morning hours
      const isMorningSlot = workingHours.morning_start && workingHours.morning_end &&
        slotTime >= workingHours.morning_start && slotTime <= workingHours.morning_end;
      
      // Check if slot is within evening hours
      const isEveningSlot = workingHours.evening_start && workingHours.evening_end &&
        slotTime >= workingHours.evening_start && slotTime <= workingHours.evening_end;

      return isMorningSlot || isEveningSlot;
    }) || [];

    // Get current bookings for each time slot
    const { data: bookings, error: bookingsError } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .eq('status', 'pending');

    if (bookingsError) throw bookingsError;

    // Count bookings for each time slot
    const bookingCounts = bookings?.reduce((acc, booking) => {
      // Convert booking time to 24h format for comparison
      const time24 = convertTo24Hour(booking.appointment_time);
      acc[time24] = (acc[time24] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Format slots with booking counts and convert times to 12h format
    const formattedSlots: TimeSlot[] = slots.map(slot => ({
      time: convertTo12Hour(slot.time),
      maxBookings: slot.max_bookings,
      currentBookings: bookingCounts[slot.time] || 0
    }));

    // Apply time restrictions for today's slots
    if (isToday(selectedDate)) {
      return formattedSlots.filter(slot => {
        // Convert 12h time back to 24h for comparison
        const time24 = convertTo24Hour(slot.time);
        const slotDateTime = parse(`${date} ${time24}`, 'yyyy-MM-dd HH:mm', new Date());
        const slotTimeInIST = utcToZonedTime(slotDateTime, TIMEZONE);
        
        // Block past time slots
        if (isBefore(slotTimeInIST, istNow)) {
          return false;
        }

        // Rule 1: At 9 AM IST, block all morning slots
        if (istNow.getHours() >= 9 && slotTimeInIST.getHours() < 12) {
          return false;
        }

        // Rule 2: At 1 PM IST, block all evening slots
        if (istNow.getHours() >= 13) {
          return false;
        }

        return true;
      });
    }

    return formattedSlots;
  } catch (error) {
    console.error('Error generating time slots:', error);
    return [];
  }
};

export const isSlotAvailable = async (date: string, time: string): Promise<boolean> => {
  try {
    // Convert input time to 24h format for database comparison
    const time24 = convertTo24Hour(time);
    
    // Parse and convert to IST
    const istNow = utcToZonedTime(new Date(), TIMEZONE);
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    const selectedDate = utcToZonedTime(parsedDate, TIMEZONE);
    const dayName = format(selectedDate, 'EEEE');

    // Check working hours
    const { data: workingHours, error: workingHoursError } = await supabase
      .from('working_hours')
      .select('*')
      .eq('day', dayName)
      .single();

    if (workingHoursError || !workingHours || !workingHours.is_working) {
      return false;
    }

    // Check if time slot is available
    const { data: timeSlot, error: timeSlotError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('time', time24)
      .eq('is_available', true)
      .single();

    if (timeSlotError || !timeSlot) {
      return false;
    }

    // Check current bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .eq('status', 'pending');

    if (bookingsError) throw bookingsError;

    return (bookings?.length || 0) < timeSlot.max_bookings;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    return false;
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

    // Check working hours
    const { data: workingHours, error: workingHoursError } = await supabase
      .from('working_hours')
      .select('*')
      .eq('day', dayName)
      .single();

    if (workingHoursError || !workingHours || !workingHours.is_working) {
      return { isValid: false, error: 'Selected day is not available for appointments' };
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
    }

    // Validate time slot availability
    const isAvailable = await isSlotAvailable(date, timeSlot);
    if (!isAvailable) {
      return { isValid: false, error: 'This time slot is no longer available' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error in validateBookingRequest:', error);
    return { isValid: false, error: 'An unexpected error occurred. Please try again later' };
  }
};
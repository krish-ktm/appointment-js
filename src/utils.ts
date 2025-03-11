import { TimeSlot } from './types';
import { supabase } from './lib/supabase';
import { startOfToday, addDays, format, parse, isToday, isTomorrow, isAfter, isBefore } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

export const generateTimeSlots = async (date: string): Promise<TimeSlot[]> => {
  const baseSlots = [
    // Morning slots (9:30 AM to 12:00 PM)
    '9:30 AM', '9:45 AM',
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM',
    // Evening slots (4:00 PM to 6:30 PM)
    '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
    '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM',
    '6:00 PM', '6:15 PM', '6:30 PM'
  ];

  // Initialize slots with max 3 bookings
  const slots: TimeSlot[] = baseSlots.map(time => ({
    time,
    maxBookings: 3,
    currentBookings: 0
  }));

  // Get current time in IST
  const istNow = utcToZonedTime(new Date(), TIMEZONE);
  
  // Convert selected date to IST
  const selectedDate = utcToZonedTime(new Date(date), TIMEZONE);
  
  // Check if selected date is today or tomorrow
  const isSelectedToday = isToday(selectedDate);
  const isSelectedTomorrow = isTomorrow(selectedDate);

  try {
    // Get current bookings for each time slot
    const { data: bookings, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .eq('status', 'pending');

    if (!error && bookings) {
      // Count bookings for each time slot
      const bookingCounts = bookings.reduce((acc, booking) => {
        acc[booking.appointment_time] = (acc[booking.appointment_time] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Update slots with booking counts and apply time restrictions
      slots.forEach(slot => {
        slot.currentBookings = bookingCounts[slot.time] || 0;
        
        if (isSelectedToday) {
          const slotTime = parse(slot.time, 'h:mm a', new Date());
          const slotTimeInIST = utcToZonedTime(slotTime, TIMEZONE);
          
          // Block past time slots
          if (isBefore(slotTimeInIST, istNow)) {
            slot.currentBookings = slot.maxBookings;
          }

          // Rule 1: At 9 AM IST, block all morning slots (9:30 AM to 12 PM)
          if (istNow.getHours() >= 9 && slotTimeInIST.getHours() < 12) {
            slot.currentBookings = slot.maxBookings;
          }

          // Rule 2: At 1 PM IST, block all evening slots (4 PM to 6:30 PM)
          if (istNow.getHours() >= 13) {
            slot.currentBookings = slot.maxBookings;
          }
        }
      });
    }

    return slots;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return [];
  }
};

export const isSlotAvailable = async (date: string, time: string): Promise<boolean> => {
  // Convert to IST
  const istNow = utcToZonedTime(new Date(), TIMEZONE);
  const selectedDate = utcToZonedTime(new Date(date), TIMEZONE);
  
  // Check if selected date is today
  const isSelectedToday = isToday(selectedDate);

  if (isSelectedToday) {
    const slotTime = parse(time, 'h:mm a', new Date());
    const slotTimeInIST = utcToZonedTime(slotTime, TIMEZONE);

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
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('id')
    .eq('appointment_date', date)
    .eq('appointment_time', time)
    .eq('status', 'pending');

  if (error) {
    console.error('Error checking slot availability:', error);
    return false;
  }

  return data.length < 3; // Max 3 appointments per slot
};

export const validateBookingRequest = async (
  phone: string,
  date: string,
  timeSlot: string
): Promise<{ isValid: boolean; error?: string }> => {
  // Validate phone number (10 digits)
  if (!/^\d{10}$/.test(phone)) {
    return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
  }

  // Check if the user already has a booking for the same day
  const { data: existingBookings, error: bookingError } = await supabase
    .from('appointments')
    .select('id')
    .eq('phone', phone)
    .eq('appointment_date', date)
    .eq('status', 'pending');

  if (bookingError) {
    return { isValid: false, error: 'Error checking existing bookings' };
  }

  if (existingBookings && existingBookings.length > 0) {
    return { isValid: false, error: 'You already have a booking for this date' };
  }

  // Validate time slot availability
  const isAvailable = await isSlotAvailable(date, timeSlot);
  if (!isAvailable) {
    return { isValid: false, error: 'This time slot is no longer available' };
  }

  return { isValid: true };
};
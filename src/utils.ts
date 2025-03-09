import { TimeSlot } from './types';
import { supabase } from './lib/supabase';

export const generateTimeSlots = async (date: string): Promise<TimeSlot[]> => {
  const baseSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM',
    '11:00 PM'
  ];

  // Initialize slots with max 4 bookings
  const slots: TimeSlot[] = baseSlots.map(time => ({
    time,
    maxBookings: 4,
    currentBookings: 0
  }));

  // Get current date and time in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset (UTC+5:30)
  const istNow = new Date(now.getTime() + istOffset);
  
  // Get selected date in IST
  const selectedDate = new Date(date);
  const istSelectedDate = new Date(selectedDate.getTime() + istOffset);
  
  // Reset hours to compare just the dates
  const istToday = new Date(istNow);
  istToday.setHours(0, 0, 0, 0);
  
  const selectedDateStart = new Date(istSelectedDate);
  selectedDateStart.setHours(0, 0, 0, 0);
  
  // Check if selected date is today
  const isToday = selectedDateStart.getTime() === istToday.getTime();

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
        
        if (isToday) {
          const istHour = istNow.getHours();
          const [slotHour, slotMinute, period] = slot.time.match(/(\d+):(\d+)\s+(AM|PM)/)?.slice(1) || [];
          const slotHour24 = (parseInt(slotHour) % 12) + (period === 'PM' ? 12 : 0);

          // Rule 1: At 9 AM IST, block all morning slots (9 AM to 12 PM)
          if (istHour >= 9 && slotHour24 < 12) {
            slot.currentBookings = slot.maxBookings;
          }

          // Rule 2: At 1 PM IST, block all remaining slots for today
          if (istHour >= 13) {
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
  // Get current date and time in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset (UTC+5:30)
  const istNow = new Date(now.getTime() + istOffset);
  
  // Get selected date in IST
  const selectedDate = new Date(date);
  const istSelectedDate = new Date(selectedDate.getTime() + istOffset);
  
  // Reset hours to compare just the dates
  const istToday = new Date(istNow);
  istToday.setHours(0, 0, 0, 0);
  
  const selectedDateStart = new Date(istSelectedDate);
  selectedDateStart.setHours(0, 0, 0, 0);
  
  // Check if selected date is today
  const isToday = selectedDateStart.getTime() === istToday.getTime();

  if (isToday) {
    const istHour = istNow.getHours();
    const [slotHour, slotMinute, period] = time.match(/(\d+):(\d+)\s+(AM|PM)/)?.slice(1) || [];
    const slotHour24 = (parseInt(slotHour) % 12) + (period === 'PM' ? 12 : 0);

    // Rule 1: At 9 AM IST, block all morning slots (9 AM to 12 PM)
    if (istHour >= 9 && slotHour24 < 12) {
      return false;
    }

    // Rule 2: At 1 PM IST, block all remaining slots for today
    if (istHour >= 13) {
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

  return data.length < 4; // Max 4 appointments per slot
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
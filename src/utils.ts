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

  const now = new Date();
  const selectedDate = new Date(date);
  
  // Reset hours to compare just the dates
  now.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  const isToday = selectedDate.getTime() === now.getTime();
  
  // Compare with tomorrow's date
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = selectedDate.getTime() === tomorrow.getTime();

  // If the date is not today or tomorrow, return empty slots
  if (!isToday && !isTomorrow) {
    return [];
  }

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
          const [slotHour, slotMinute, period] = slot.time.match(/(\d+):(\d+)\s+(AM|PM)/)?.slice(1) || [];
          const slotTime = new Date();
          slotTime.setHours(
            (parseInt(slotHour) % 12) + (period === 'PM' ? 12 : 0),
            parseInt(slotMinute)
          );

          // Block past time slots
          if (slotTime <= new Date()) {
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
  const now = new Date();
  const selectedDate = new Date(date);
  
  // Reset hours to compare just the dates
  now.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  const isToday = selectedDate.getTime() === now.getTime();
  
  // Compare with tomorrow's date
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = selectedDate.getTime() === tomorrow.getTime();
  
  // Only allow bookings for today and tomorrow
  if (!isToday && !isTomorrow) {
    return false;
  }

  // Apply same time restrictions as in generateTimeSlots
  if (isToday) {
    const [slotHour, slotMinute, period] = time.match(/(\d+):(\d+)\s+(AM|PM)/)?.slice(1) || [];
    const slotTime = new Date();
    slotTime.setHours(
      (parseInt(slotHour) % 12) + (period === 'PM' ? 12 : 0),
      parseInt(slotMinute)
    );

    // Block past time slots
    if (slotTime <= new Date()) {
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
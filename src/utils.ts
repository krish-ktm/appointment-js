import { TimeSlot } from './types';
import { supabase } from './lib/supabase';

// Rate limiting cache
const rateLimitCache: Record<string, { count: number; timestamp: number }> = {};
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_BOOKINGS_PER_HOUR = 5; // Increased to allow more bookings per hour

// Phone number validation
const isValidPhoneNumber = (phone: string): boolean => {
  // Allow Indian phone numbers (10 digits, optionally starting with +91)
  const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// Check if user has exceeded rate limit
const isRateLimited = (identifier: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitCache[identifier];

  if (!userLimit || (now - userLimit.timestamp) > RATE_LIMIT_WINDOW) {
    rateLimitCache[identifier] = { count: 1, timestamp: now };
    return false;
  }

  if (userLimit.count >= MAX_BOOKINGS_PER_HOUR) {
    return true;
  }

  userLimit.count++;
  return false;
};

export const validateBookingRequest = async (
  phone: string,
  date: string,
  time: string
): Promise<{ isValid: boolean; error?: string }> => {
  // 1. Validate phone number format
  if (!isValidPhoneNumber(phone)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }

  // 2. Check rate limiting
  if (isRateLimited(phone)) {
    return { 
      isValid: false, 
      error: `Maximum ${MAX_BOOKINGS_PER_HOUR} bookings allowed per hour` 
    };
  }

  return { isValid: true };
};

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
  const isToday = selectedDate.toDateString() === now.toDateString();
  const isTomorrow = new Date(now.setDate(now.getDate() + 1)).toDateString() === selectedDate.toDateString();
  
  // If the date is not today or tomorrow, return empty slots
  if (!isToday && !isTomorrow) {
    return [];
  }

  if (date) {
    // Get current bookings for each time slot
    const { data: bookings, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .eq('status', 'pending');

    if (!error && bookings) {
      // Count bookings for each time slot manually
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

          const currentHour = now.getHours();
          
          // Block morning slots if current time is before 9 AM
          if (currentHour < 9) {
            const slotHourNum = (parseInt(slotHour) % 12) + (period === 'PM' ? 12 : 0);
            if (slotHourNum < 13) { // Block all slots before 1 PM
              slot.currentBookings = slot.maxBookings;
            }
          }
          
          // If current time is after 1 PM, block all remaining slots for today
          if (currentHour >= 13) {
            slot.currentBookings = slot.maxBookings;
          }
          
          // Block past time slots
          if (slotTime <= now) {
            slot.currentBookings = slot.maxBookings;
          }
        }
      });
    }
  }

  return slots;
};

export const isSlotAvailable = async (date: string, time: string): Promise<boolean> => {
  const now = new Date();
  const selectedDate = new Date(date);
  const isToday = selectedDate.toDateString() === now.toDateString();
  const isTomorrow = new Date(now.setDate(now.getDate() + 1)).toDateString() === selectedDate.toDateString();
  
  // Only allow bookings for today and tomorrow
  if (!isToday && !isTomorrow) {
    return false;
  }

  // Apply same time restrictions as in generateTimeSlots
  if (isToday) {
    const currentHour = now.getHours();
    const [slotHour, slotMinute, period] = time.match(/(\d+):(\d+)\s+(AM|PM)/)?.slice(1) || [];
    const slotTime = new Date();
    slotTime.setHours(
      (parseInt(slotHour) % 12) + (period === 'PM' ? 12 : 0),
      parseInt(slotMinute)
    );

    // Block morning slots if current time is before 9 AM
    if (currentHour < 9) {
      const slotHourNum = (parseInt(slotHour) % 12) + (period === 'PM' ? 12 : 0);
      if (slotHourNum < 13) {
        return false;
      }
    }

    // Block all slots if current time is after 1 PM
    if (currentHour >= 13) {
      return false;
    }

    // Block past time slots
    if (slotTime <= now) {
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
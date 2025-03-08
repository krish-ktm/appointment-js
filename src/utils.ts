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

  if (date) {
    // Get current bookings for each time slot
    const { data: bookings, error } = await supabase
      .from('appointments')
      .select('appointment_time, count')
      .eq('appointment_date', date)
      .eq('status', 'pending')
      .group_by('appointment_time');

    if (!error && bookings) {
      bookings.forEach(booking => {
        const slot = slots.find(s => s.time === booking.appointment_time);
        if (slot) {
          slot.currentBookings = parseInt(booking.count);
        }
      });
    }
  }

  return slots;
};

export const isSlotAvailable = async (date: string, time: string): Promise<boolean> => {
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
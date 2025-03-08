import { TimeSlot } from './types';

export const generateTimeSlots = (): TimeSlot[] => {
  const morningSlots = generateSlots('9:30', '12:30');
  const eveningSlots = generateSlots('16:00', '18:00');
  return [...morningSlots, ...eveningSlots];
};

const generateSlots = (start: string, end: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startTime = new Date(`2024-01-01 ${start}`);
  const endTime = new Date(`2024-01-01 ${end}`);

  while (startTime < endTime) {
    slots.push({
      time: startTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      maxBookings: 3,
      currentBookings: 0
    });
    startTime.setMinutes(startTime.getMinutes() + 15);
  }

  return slots;
};
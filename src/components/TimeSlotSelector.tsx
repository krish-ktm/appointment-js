import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { TimeSlot } from '../types';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  label: string;
}

export function TimeSlotSelector({ timeSlots, selectedTime, onSelectTime }: TimeSlotSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {timeSlots.map((slot, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
          type="button"
          disabled={slot.currentBookings >= slot.maxBookings}
          onClick={() => onSelectTime(slot.time)}
          className={`
            p-3 rounded-xl flex flex-col items-center justify-center text-sm
            ${
              selectedTime === slot.time
                ? 'bg-blue-600 text-white border-blue-600'
                : slot.currentBookings >= slot.maxBookings
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }
          `}
        >
          <Clock className="h-4 w-4 mb-1" />
          <span>{slot.time}</span>
          {slot.currentBookings < slot.maxBookings && (
            <span className="text-xs mt-1">
              {slot.maxBookings - slot.currentBookings} slots left
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
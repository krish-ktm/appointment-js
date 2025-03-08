import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { TimeSlot } from '../types';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  label: string;
}

export function TimeSlotSelector({ timeSlots, selectedTime, onSelectTime, label }: TimeSlotSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}*
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {timeSlots.map((slot, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            type="button"
            disabled={slot.currentBookings >= slot.maxBookings}
            onClick={() => onSelectTime(slot.time)}
            className={`p-3 rounded-xl flex items-center justify-center text-sm border ${
              selectedTime === slot.time
                ? 'bg-blue-600 border-blue-600 text-white'
                : slot.currentBookings >= slot.maxBookings
                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors'
            }`}
          >
            <Clock className="h-4 w-4 mr-2" />
            {slot.time}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
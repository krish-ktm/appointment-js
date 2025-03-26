import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { TimeSlot } from './types';

interface TimeSlotTranslations {
  timeSlot: string;
  slotAvailable: string;
  noTimeSlots: string;
  selectAnotherDate: string;
}

interface MRTimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedTime: string | undefined;
  onSelectTime: (time: string) => void;
  t: TimeSlotTranslations;
}

export function MRTimeSlotSelector({ slots, selectedTime, onSelectTime, t }: MRTimeSlotSelectorProps) {
  if (!slots.length) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
        <p className="text-orange-800 font-medium">{t.noTimeSlots}</p>
        <p className="text-sm text-orange-600 mt-1">{t.selectAnotherDate}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Clock className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="font-medium text-gray-900">{t.timeSlot}</h3>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot, index) => {
          const isUnavailable = slot.currentBookings !== undefined && 
                               slot.currentBookings >= slot.maxBookings;
          
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              type="button"
              disabled={isUnavailable}
              onClick={() => onSelectTime(slot.time)}
              className={`
                relative p-2 rounded-lg flex flex-col items-center justify-center border
                ${selectedTime === slot.time
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : isUnavailable
                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 text-gray-700'
                }
              `}
            >
              <span className="text-sm font-medium">{slot.time}</span>
              {!isUnavailable && slot.currentBookings !== undefined && (
                <span className={`text-xs ${
                  selectedTime === slot.time 
                    ? 'text-blue-600/80' 
                    : 'text-gray-500'
                }`}>
                  {slot.maxBookings - slot.currentBookings} {t.slotAvailable}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
} 
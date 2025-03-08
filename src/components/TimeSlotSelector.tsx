import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';
import { TimeSlot } from '../types';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  label: string;
}

export function TimeSlotSelector({ timeSlots, selectedTime, onSelectTime }: TimeSlotSelectorProps) {
  const availableSlots = timeSlots.filter(slot => slot.currentBookings < slot.maxBookings);
  
  if (timeSlots.length === 0 || availableSlots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center"
      >
        <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-orange-800 mb-2">
          No Time Slots Available
        </h3>
        <p className="text-orange-600">
          {timeSlots.length === 0 
            ? "Please select a valid date to view available time slots."
            : "All time slots for this date are either full or no longer available. Please try selecting a different date."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map((slot, index) => {
          const isUnavailable = slot.currentBookings >= slot.maxBookings;
          
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              type="button"
              disabled={isUnavailable}
              onClick={() => onSelectTime(slot.time)}
              className={`
                relative p-3 rounded-xl flex flex-col items-center justify-center text-sm
                ${
                  selectedTime === slot.time
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                    : isUnavailable
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md transition-all'
                }
              `}
            >
              <Clock className="h-4 w-4 mb-1" />
              <span>{slot.time}</span>
              {!isUnavailable && (
                <span className="text-xs mt-1 font-medium">
                  {slot.maxBookings - slot.currentBookings} slots left
                </span>
              )}
              {isUnavailable && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
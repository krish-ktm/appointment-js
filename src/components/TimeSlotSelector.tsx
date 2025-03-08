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
        className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center"
      >
        <AlertCircle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
        <h3 className="text-base font-medium text-orange-800 mb-1">
          No Time Slots Available
        </h3>
        <p className="text-sm text-orange-600">
          {timeSlots.length === 0 
            ? "Please select a valid date to view available time slots."
            : "All time slots for this date are either full or no longer available. Please try selecting a different date."}
        </p>
      </motion.div>
    );
  }

  // Group time slots by period (Morning, Afternoon, Evening)
  const groupedSlots = timeSlots.reduce((acc, slot) => {
    const time = slot.time;
    let period = 'Morning';
    if (time.includes('PM')) {
      const hour = parseInt(time.split(':')[0]);
      period = hour < 5 ? 'Afternoon' : 'Evening';
    }
    if (!acc[period]) acc[period] = [];
    acc[period].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedSlots).map(([period, slots]) => (
        <div key={period} className="space-y-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{period}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
            {slots.map((slot, index) => {
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
                    relative p-2 rounded-lg flex flex-col items-center justify-center border
                    ${
                      selectedTime === slot.time
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : isUnavailable
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 text-gray-700'
                    }
                  `}
                >
                  <span className="text-xs font-medium">{slot.time}</span>
                  {!isUnavailable && (
                    <span className={`text-[10px] ${
                      selectedTime === slot.time 
                        ? 'text-blue-600/80' 
                        : 'text-gray-500'
                    }`}>
                      {slot.maxBookings - slot.currentBookings} left
                    </span>
                  )}
                  {isUnavailable && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1">
                      <span className="flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                      </span>
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
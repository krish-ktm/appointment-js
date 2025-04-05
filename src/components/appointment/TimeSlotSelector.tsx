import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';
import { TimeSlot } from '../../types';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  label: string;
  t: any;
  loading?: boolean;
}

export function TimeSlotSelector({ timeSlots, selectedTime, onSelectTime, t, loading = false }: TimeSlotSelectorProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900">{t.timeSlot}</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Loading available time slots...</p>
          </div>
        </div>
      </motion.div>
    );
  }

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
          {t.noSlots}
        </h3>
        <p className="text-sm text-orange-600">
          {timeSlots.length === 0 
            ? t.selectDate
            : t.noSlotsAvailable}
        </p>
      </motion.div>
    );
  }

  // Sort time slots by time
  const sortedSlots = [...timeSlots].sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
    const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
    return timeA - timeB;
  });

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 sm:gap-1.5">
      {sortedSlots.map((slot, index) => {
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
              relative p-1.5 sm:p-2 rounded-lg flex flex-col items-center justify-center border
              ${
                selectedTime === slot.time
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : isUnavailable
                  ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 text-gray-700'
              }
            `}
          >
            <span className="text-[10px] sm:text-xs font-medium">{slot.time}</span>
            {!isUnavailable && (
              <span className={`text-[8px] sm:text-[10px] ${
                selectedTime === slot.time 
                  ? 'text-blue-600/80' 
                  : 'text-gray-500'
              }`}>
                {slot.maxBookings - slot.currentBookings} {t.slotsLeft}
              </span>
            )}
            {isUnavailable && (
              <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 sm:-mt-1 sm:-mr-1">
                <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-400"></span>
                </span>
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
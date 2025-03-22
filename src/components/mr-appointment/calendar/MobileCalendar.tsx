import { useState, useCallback } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileCalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  isDateDisabled: (date: Date) => boolean;
  dateBookings: Record<string, { current: number; max: number }>;
  t: any;
}

const TIMEZONE = 'Asia/Kolkata';

export function MobileCalendar({ selectedDate, onDateChange, isDateDisabled, dateBookings, t }: MobileCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = utcToZonedTime(new Date(), TIMEZONE);
    return startOfWeek(today, { weekStartsOn: 1 }); // Start week on Monday
  });

  // Generate dates for the current week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const handlePrevWeek = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const handleDateClick = (e: React.MouseEvent, date: Date) => {
    e.preventDefault(); // Prevent form submission
    if (!isDateDisabled(date)) {
      onDateChange(date);
    }
  };

  const formatDayName = useCallback((date: Date) => {
    const dayKey = format(date, 'EEEE').toLowerCase() as keyof typeof t.days;
    return t.days[dayKey];
  }, [t]);

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevWeek}
          type="button"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div className="text-sm font-medium text-gray-900">
          {format(currentWeekStart, 'MMMM yyyy')}
        </div>
        <button
          onClick={handleNextWeek}
          type="button"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isDisabled = isDateDisabled(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const bookingInfo = dateBookings[dateStr];
          const isFull = bookingInfo && bookingInfo.current >= bookingInfo.max;
          const isAvailable = !isDisabled && !isFull;

          return (
            <button
              key={dateStr}
              onClick={(e) => handleDateClick(e, date)}
              type="button"
              disabled={!isAvailable}
              className={`
                relative flex flex-col items-center justify-center p-2 rounded-lg transition-all min-h-[80px]
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isAvailable
                    ? 'bg-white hover:bg-blue-50 text-gray-900'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                }
              `}
            >
              {/* Day Name */}
              <span className="text-[10px] font-medium mb-1">
                {formatDayName(date).slice(0, 3)}
              </span>
              
              {/* Date */}
              <span className={`text-sm font-semibold mb-1 ${isToday(date) ? 'ring-2 ring-blue-500 rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                {format(date, 'd')}
              </span>

              {/* Slots Available */}
              {isAvailable && bookingInfo && (
                <span className={`text-[10px] ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                  {bookingInfo.max - bookingInfo.current} slots
                </span>
              )}

              {/* Availability Indicator */}
              {isAvailable && bookingInfo && (
                <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                  bookingInfo.current === 0
                    ? 'bg-green-500'
                    : bookingInfo.current < bookingInfo.max
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-600">Filling</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600">Full</span>
        </div>
      </div>
    </div>
  );
}
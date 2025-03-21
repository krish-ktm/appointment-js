import { useEffect, useState, useMemo, useCallback } from 'react';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format, isWeekend, isSameDay, startOfToday, isBefore, addMonths } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { useTranslation } from '../../i18n/useTranslation';
import { supabase } from '../../lib/supabase';

interface MRAppointmentCalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  onValidationError?: (error: string) => void;
}

const TIMEZONE = 'Asia/Kolkata';

export function MRAppointmentCalendar({ selectedDate, onDateChange, onValidationError }: MRAppointmentCalendarProps) {
  const { t } = useTranslation();
  const [closureDates, setClosureDates] = useState<string[]>([]);
  const [nonWorkingDays, setNonWorkingDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [workingDaysMap, setWorkingDaysMap] = useState<{ [key: string]: number }>({});
  const [dateBookings, setDateBookings] = useState<Record<string, { current: number; max: number }>>({});
  
  useEffect(() => {
    loadClosureDates();
    loadWorkingDays();
  }, []);

  const loadClosureDates = async () => {
    try {
      const { data, error } = await supabase
        .from('mr_closure_dates')
        .select('date')
        .gte('date', format(startOfToday(), 'yyyy-MM-dd'));

      if (error) throw error;
      setClosureDates((data || []).map(d => d.date));
    } catch (error) {
      console.error('Error loading closure dates:', error);
    }
  };

  const loadWorkingDays = async () => {
    try {
      const { data, error } = await supabase
        .from('mr_weekdays')
        .select('day, is_working, max_appointments');

      if (error) throw error;
      
      // Store non-working days
      setNonWorkingDays((data || [])
        .filter(d => !d.is_working)
        .map(d => d.day));

      // Store working days map
      const workingDays = data?.reduce((acc, day) => {
        if (day.is_working) {
          acc[day.day] = day.max_appointments;
        }
        return acc;
      }, {} as { [key: string]: number });
      
      setWorkingDaysMap(workingDays || {});

      // Load current bookings for the next 6 months
      const today = startOfToday();
      const sixMonthsLater = addMonths(today, 6);
      
      const { data: bookings, error: bookingsError } = await supabase
        .from('mr_appointments')
        .select('appointment_date')
        .gte('appointment_date', format(today, 'yyyy-MM-dd'))
        .lt('appointment_date', format(sixMonthsLater, 'yyyy-MM-dd'))
        .eq('status', 'pending');

      if (bookingsError) throw bookingsError;

      // Count bookings by date
      const bookingCounts = (bookings || []).reduce((acc, booking) => {
        acc[booking.appointment_date] = (acc[booking.appointment_date] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      // Create date bookings object for the next 6 months
      const newDateBookings: Record<string, { current: number; max: number }> = {};
      let currentDate = today;
      
      while (currentDate < sixMonthsLater) {
        const dayName = format(currentDate, 'EEEE');
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const maxAppointments = workingDays?.[dayName] || 0;
        
        if (maxAppointments > 0) {
          newDateBookings[dateStr] = {
            current: bookingCounts[dateStr] || 0,
            max: maxAppointments
          };
        }
        
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }

      setDateBookings(newDateBookings);
    } catch (error) {
      console.error('Error loading working days:', error);
    }
  };

  const isDateDisabled = useCallback((date: Date) => {
    const today = startOfToday();
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE');
    return (
      isBefore(date, today) || 
      closureDates.includes(dateStr) ||
      nonWorkingDays.includes(dayName)
    );
  }, [closureDates, nonWorkingDays]);

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      onDateChange(null);
      return;
    }
    onDateChange(date);
  };

  const formatSelectedDate = useCallback((date: Date) => {
    const istDate = utcToZonedTime(date, TIMEZONE);
    const dayName = t.mrAppointment.form.days[format(istDate, 'EEEE').toLowerCase() as keyof typeof t.mrAppointment.form.days];
    const monthName = t.mrAppointment.form.months[format(istDate, 'MMMM').toLowerCase() as keyof typeof t.mrAppointment.form.months];
    const day = format(istDate, 'd');
    const year = format(istDate, 'yyyy');
    return `${dayName}, ${monthName} ${day}, ${year}`;
  }, [t.mrAppointment.form.days, t.mrAppointment.form.months]);

  const renderDayContents = useCallback((day: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE');
    const isDisabled = isDateDisabled(date);
    
    // If it's a working day, show slots even if no bookings yet
    const maxAppointments = workingDaysMap[dayName] || 0;
    const currentBookings = dateBookings[dateStr]?.current || 0;
    const hasSlots = maxAppointments > 0;
    
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[40px]">
        <span className="leading-none mb-1">{day}</span>
        {hasSlots && !isDisabled && (
          <span className={`text-[10px] leading-none ${
            selectedDate && isSameDay(date, selectedDate)
              ? 'text-white'
              : 'text-gray-500'
          }`}>
            {maxAppointments - currentBookings} slots
          </span>
        )}
      </div>
    );
  }, [dateBookings, selectedDate, isDateDisabled, workingDaysMap]);

  const dayClassName = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isDisabled = isDateDisabled(date);
    const isTodays = isSameDay(date, new Date());
    
    if (isDisabled) {
      return "!text-gray-300 hover:!bg-transparent cursor-not-allowed opacity-50";
    }
    if (isSelected) {
      return "!bg-blue-600 !text-white hover:!bg-blue-700 ring-4 ring-blue-100";
    }
    if (isTodays) {
      return "!bg-blue-50/50 !text-blue-600 font-medium hover:!bg-blue-100";
    }
    return "!text-gray-700 hover:!bg-blue-50 hover:!text-blue-600 transition-all duration-200";
  }, [selectedDate, isDateDisabled]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t.mrAppointment.form.appointmentDate} *
      </label>
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className={`p-2 rounded-lg transition-colors ${
            selectedDate 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-50 text-blue-600'
          }`}>
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              selectedDate
                ? 'text-blue-600'
                : 'text-gray-900'
            }`}>
              {selectedDate
                ? formatSelectedDate(selectedDate)
                : t.mrAppointment.form.selectDate}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {t.mrAppointment.form.availableWeekdays}
            </p>
          </div>
        </div>
        
        <div className="w-full relative pb-4">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={startOfToday()}
            maxDate={addMonths(new Date(), 6)}
            filterDate={(date) => !isDateDisabled(date)}
            dateFormat="MMMM d, yyyy"
            placeholderText={t.mrAppointment.form.selectDate}
            required
            inline
            calendarClassName="!bg-transparent !border-0 !shadow-none w-full"
            dayClassName={dayClassName}
            renderDayContents={renderDayContents}
            popperPlacement="bottom"
            popperModifiers={[
              {
                name: "preventOverflow",
                options: {
                  padding: 16
                }
              }
            ]}
          />
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Available slots</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              <span>Not available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
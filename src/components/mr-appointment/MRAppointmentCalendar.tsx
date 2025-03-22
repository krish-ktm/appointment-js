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
      
      const workingDays = data?.reduce((acc, day) => {
        if (day.is_working) {
          acc[day.day] = day.max_appointments;
        }
        return acc;
      }, {} as { [key: string]: number });
      
      setWorkingDaysMap(workingDays || {});

      const today = startOfToday();
      const sixMonthsLater = addMonths(today, 6);
      
      const { data: bookings, error: bookingsError } = await supabase
        .from('mr_appointments')
        .select('appointment_date')
        .gte('appointment_date', format(today, 'yyyy-MM-dd'))
        .lt('appointment_date', format(sixMonthsLater, 'yyyy-MM-dd'))
        .eq('status', 'pending');

      if (bookingsError) throw bookingsError;

      const bookingCounts = (bookings || []).reduce((acc, booking) => {
        acc[booking.appointment_date] = (acc[booking.appointment_date] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

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
      !workingDaysMap[dayName]
    );
  }, [closureDates, workingDaysMap]);

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
    
    const maxAppointments = workingDaysMap[dayName] || 0;
    const currentBookings = dateBookings[dateStr]?.current || 0;
    const hasSlots = maxAppointments > 0;
    const availableSlots = maxAppointments - currentBookings;
    const isFull = currentBookings >= maxAppointments;
    
    return (
      <div className="mr-calendar-day">
        <span className="mr-calendar-day__number">{day}</span>
        {hasSlots && !isDisabled && (
          <>
            <span className="mr-calendar-day__slots">
              {availableSlots} slots
            </span>
            <span className={`mr-calendar-day__indicator ${
              isFull ? 'mr-calendar-day__indicator--full' : 'mr-calendar-day__indicator--available'
            }`} />
          </>
        )}
      </div>
    );
  }, [dateBookings, selectedDate, isDateDisabled, workingDaysMap]);

  const dayClassName = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isDisabled = isDateDisabled(date);
    const isTodays = isSameDay(date, new Date());
    
    if (isDisabled) return "react-datepicker__day--disabled";
    if (isSelected) return "react-datepicker__day--selected";
    if (isTodays) return "react-datepicker__day--today";
    return "";
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
        
        <div className="w-full relative">
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            minDate={startOfToday()}
            maxDate={addMonths(new Date(), 6)}
            filterDate={(date) => !isDateDisabled(date)}
            dateFormat="MMMM d, yyyy"
            placeholderText={t.mrAppointment.form.selectDate}
            required
            inline
            calendarClassName="mr-calendar"
            dayClassName={dayClassName}
            renderDayContents={renderDayContents}
          />
        </div>
        
        <div className="mr-calendar__legend">
          <div className="mr-calendar__legend-item">
            <span className="mr-calendar__legend-dot mr-calendar__legend-dot--available"></span>
            <span>Available</span>
          </div>
          <div className="mr-calendar__legend-item">
            <span className="mr-calendar__legend-dot mr-calendar__legend-dot--full"></span>
            <span>Full</span>
          </div>
          <div className="mr-calendar__legend-item">
            <span className="mr-calendar__legend-dot mr-calendar__legend-dot--disabled"></span>
            <span>Not available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
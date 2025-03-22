import { useState, useEffect } from 'react';
import { addMonths, format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { MobileCalendar } from './calendar/MobileCalendar';
import { DesktopCalendar } from './calendar/DesktopCalendar';

interface MRAppointmentCalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export function MRAppointmentCalendar({ selectedDate, onDateChange }: MRAppointmentCalendarProps) {
  const [loading, setLoading] = useState(false);
  const [workingDaysMap, setWorkingDaysMap] = useState<{ [key: string]: number }>({});
  const [dateBookings, setDateBookings] = useState<Record<string, { current: number; max: number }>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mrClosureDates, setMRClosureDates] = useState<string[]>([]);
  const [clinicClosureDates, setClinicClosureDates] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    loadClosureDates();
    loadWorkingDays();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadClosureDates = async () => {
    try {
      const [mrResponse, clinicResponse] = await Promise.all([
        supabase
          .from('mr_closure_dates')
          .select('date')
          .gte('date', format(new Date(), 'yyyy-MM-dd')),
        supabase
          .from('clinic_closure_dates')
          .select('date')
          .gte('date', format(new Date(), 'yyyy-MM-dd'))
      ]);

      if (mrResponse.error) throw mrResponse.error;
      if (clinicResponse.error) throw clinicResponse.error;

      setMRClosureDates((mrResponse.data || []).map(d => d.date));
      setClinicClosureDates((clinicResponse.data || []).map(d => d.date));
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

      const today = new Date();
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

  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE');
    
    return (
      mrClosureDates.includes(dateStr) ||
      clinicClosureDates.includes(dateStr) ||
      !workingDaysMap[dayName]
    );
  };

  const maxDate = addMonths(new Date(), 6);

  const translations = {
    appointmentDate: "Appointment Date",
    selectDate: "Select appointment date",
    availableWeekdays: "Appointments available on weekdays only",
    days: {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday"
    },
    months: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December"
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isMobile ? (
    <MobileCalendar
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      isDateDisabled={isDateDisabled}
      dateBookings={dateBookings}
      t={translations}
    />
  ) : (
    <DesktopCalendar
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      isDateDisabled={isDateDisabled}
      dateBookings={dateBookings}
      maxDate={maxDate}
      t={translations}
    />
  );
}
import { supabase } from '../lib/supabase';
import { format, isWeekend, startOfToday, isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

export async function validateMRAppointment(date: Date): Promise<{ isValid: boolean; error?: string }> {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE');
    const today = startOfToday();

    // Check if date is in the past
    if (isBefore(date, today)) {
      return { isValid: false, error: 'Cannot book appointments for past dates' };
    }

    // Get working day settings first
    const { data: workingDay, error: workingDayError } = await supabase
      .from('mr_weekdays')
      .select('is_working, max_appointments')
      .eq('day', dayName)
      .single();

    if (workingDayError) {
      console.error('Error fetching working day settings:', workingDayError);
      return { isValid: false, error: 'Error checking working day settings' };
    }

    // If no working day settings found or day is not working
    if (!workingDay || !workingDay.is_working) {
      return { isValid: false, error: 'Appointments are not available on this day' };
    }

    // Check if it's a closure date - Changed from single() to maybeSingle()
    const { data: closureDate, error: closureError } = await supabase
      .from('mr_closure_dates')
      .select('reason')
      .eq('date', dateStr)
      .maybeSingle();

    if (closureError) {
      console.error('Error checking closure date:', closureError);
      return { isValid: false, error: 'Error checking closure dates' };
    }

    if (closureDate) {
      return { 
        isValid: false, 
        error: `Appointments are not available on this date${closureDate.reason ? `: ${closureDate.reason}` : ''}`
      };
    }

    // Check number of existing appointments
    const { data: appointments, error: appointmentsError } = await supabase
      .from('mr_appointments')
      .select('id')
      .eq('appointment_date', dateStr)
      .eq('status', 'pending');

    if (appointmentsError) {
      console.error('Error checking existing appointments:', appointmentsError);
      return { isValid: false, error: 'Error checking existing appointments' };
    }

    const currentAppointments = appointments?.length || 0;
    if (currentAppointments >= workingDay.max_appointments) {
      return { 
        isValid: false, 
        error: `Maximum appointments (${workingDay.max_appointments}) reached for this date` 
      };
    }

    // All checks passed
    return { isValid: true };
  } catch (error) {
    console.error('Error validating MR appointment:', error);
    return { isValid: false, error: 'An error occurred while validating the appointment' };
  }
}
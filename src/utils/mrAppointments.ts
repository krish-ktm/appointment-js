import { supabase } from '../lib/supabase';
import { startOfToday, format, isBefore } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export async function validateMRAppointment(date: Date): Promise<{ isValid: boolean; error?: string }> {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE');
    const today = startOfToday();

    // Check if date is in the past
    if (isBefore(date, today)) {
      return { isValid: false, error: 'Cannot book appointments for past dates' };
    }

    // Batch our database queries
    const [workingDayResponse, closureDateResponse, appointmentsResponse] = await Promise.all([
      // Get working day settings
      supabase
        .from('mr_weekdays')
        .select('is_working, max_appointments')
        .eq('day', dayName)
        .single(),
      
      // Check closure dates
      supabase
        .from('mr_closure_dates')
        .select('reason')
        .eq('date', dateStr)
        .maybeSingle(),
      
      // Get existing appointments
      supabase
        .from('mr_appointments')
        .select('id')
        .eq('appointment_date', dateStr)
        .eq('status', 'pending')
    ]);

    // Handle working day settings
    if (workingDayResponse.error || !workingDayResponse.data || !workingDayResponse.data.is_working) {
      return { isValid: false, error: 'Appointments are not available on this day' };
    }

    // Handle closure dates
    if (closureDateResponse.error) {
      console.error('Error checking closure date:', closureDateResponse.error);
      return { isValid: false, error: 'Error checking closure dates' };
    }

    if (closureDateResponse.data) {
      return { 
        isValid: false, 
        error: `Appointments are not available on this date${closureDateResponse.data.reason ? `: ${closureDateResponse.data.reason}` : ''}`
      };
    }

    // Handle appointments count
    if (appointmentsResponse.error) {
      console.error('Error checking existing appointments:', appointmentsResponse.error);
      return { isValid: false, error: 'Error checking existing appointments' };
    }

    const currentAppointments = appointmentsResponse.data?.length || 0;
    if (currentAppointments >= workingDayResponse.data.max_appointments) {
      return { 
        isValid: false, 
        error: `Maximum appointments (${workingDayResponse.data.max_appointments}) reached for this date` 
      };
    }

    // All checks passed
    return { isValid: true };
  } catch (error) {
    console.error('Error validating MR appointment:', error);
    return { isValid: false, error: 'An error occurred while validating the appointment' };
  }
}
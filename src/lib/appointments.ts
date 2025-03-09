import { supabase } from './supabase';
import { Appointment } from '../types';

export async function getTodayAndTomorrowAppointments(): Promise<{ appointments: Appointment[]; error: string | null }> {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Authentication required');
    }

    // Get today's and tomorrow's date in the local timezone
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .in('appointment_date', [todayStr, tomorrowStr])
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) throw new Error(error.message);
    
    // Sort appointments by date and time
    const sortedAppointments = appointments?.sort((a, b) => {
      const dateCompare = a.appointment_date.localeCompare(b.appointment_date);
      if (dateCompare !== 0) return dateCompare;
      
      const timeA = new Date(`1970/01/01 ${a.appointment_time}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.appointment_time}`).getTime();
      return timeA - timeB;
    }) || [];

    return { appointments: sortedAppointments as Appointment[], error: null };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return { appointments: [], error: error.message };
  }
}
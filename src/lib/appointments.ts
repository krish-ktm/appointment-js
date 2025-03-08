import { supabase } from './supabase';
import { Appointment } from '../types';

export async function getTodayAppointments(): Promise<{ appointments: Appointment[]; error: string | null }> {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Authentication required');
    }

    // Get today's date in the local timezone
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', todayStr)
      .order('appointment_time', { ascending: true });

    if (error) throw new Error(error.message);
    
    // Sort appointments by time
    const sortedAppointments = appointments?.sort((a, b) => {
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
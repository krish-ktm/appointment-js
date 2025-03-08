import { supabase } from './supabase';
import { Appointment } from '../types';

export async function getTodayAppointments(): Promise<{ appointments: Appointment[]; error: string | null }> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', today)
      .eq('status', 'pending')
      .order('appointment_time', { ascending: true });

    if (error) throw new Error(error.message);
    return { appointments: appointments as Appointment[], error: null };
  } catch (error) {
    return { appointments: [], error: error.message };
  }
}
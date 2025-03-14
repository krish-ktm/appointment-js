import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ResponsiveHeader } from '../headers/ResponsiveHeader';
import { Footer } from '../Footer';
import { MRForm } from './types';
import { MRAppointmentForm } from './MRAppointmentForm';
import { MRAppointmentCalendar } from './MRAppointmentCalendar';

export function MRAppointment() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<MRForm>({
    mr_name: '',
    company_name: '',
    division_name: '',
    contact_no: '',
    appointment_date: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.appointment_date) {
        throw new Error('Please select an appointment date');
      }

      // Validate phone number (10 digits)
      if (!/^\d{10}$/.test(form.contact_no)) {
        throw new Error('Please enter a valid 10-digit contact number');
      }

      // Check if the selected date already has 5 appointments
      const { data: existingAppointments, error: countError } = await supabase
        .from('mr_appointments')
        .select('id')
        .eq('appointment_date', format(form.appointment_date, 'yyyy-MM-dd'))
        .eq('status', 'pending');

      if (countError) throw countError;

      if (existingAppointments && existingAppointments.length >= 5) {
        throw new Error('Maximum appointments reached for this date');
      }

      // Create the appointment
      const { error } = await supabase
        .from('mr_appointments')
        .insert({
          mr_name: form.mr_name,
          company_name: form.company_name,
          division_name: form.division_name,
          contact_no: form.contact_no,
          appointment_date: format(form.appointment_date, 'yyyy-MM-dd')
        });

      if (error) throw error;

      toast.success('Appointment booked successfully');
      setForm({
        mr_name: '',
        company_name: '',
        division_name: '',
        contact_no: '',
        appointment_date: null
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/50 to-white">
      <ResponsiveHeader />
      
      <main className="flex-grow pt-20 sm:pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <h1 className="text-xl sm:text-2xl font-semibold text-white">MR Appointment Booking</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">Schedule your meeting with the doctor</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:order-2">
                  <MRAppointmentForm 
                    form={form}
                    onChange={setForm}
                  />
                </div>

                <div className="lg:order-1">
                  <MRAppointmentCalendar
                    selectedDate={form.appointment_date}
                    onDateChange={(date) => setForm({ ...form, appointment_date: date })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
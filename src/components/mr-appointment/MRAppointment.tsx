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
import { MRAppointmentConfirmation } from './MRAppointmentConfirmation';
import { useTranslation } from '../../i18n/useTranslation';
import { validateMRAppointment } from '../../utils/mrAppointments';

export function MRAppointment() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [form, setForm] = useState<MRForm>({
    mr_name: '',
    company_name: '',
    division_name: '',
    contact_no: '',
    appointment_date: null
  });

  const resetForm = () => {
    setForm({
      mr_name: '',
      company_name: '',
      division_name: '',
      contact_no: '',
      appointment_date: null
    });
    setAppointmentDetails(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.appointment_date) {
        throw new Error(t.mrAppointment.form.dateRequired);
      }

      // Validate phone number (10 digits)
      if (!/^\d{10}$/.test(form.contact_no)) {
        throw new Error(t.mrAppointment.form.invalidPhone);
      }

      // Validate appointment date
      const { isValid, error: validationError } = await validateMRAppointment(form.appointment_date);
      if (!isValid) {
        throw new Error(validationError);
      }

      // Create the appointment
      const { data: appointment, error } = await supabase
        .from('mr_appointments')
        .insert({
          mr_name: form.mr_name,
          company_name: form.company_name,
          division_name: form.division_name,
          contact_no: form.contact_no,
          appointment_date: format(form.appointment_date, 'yyyy-MM-dd')
        })
        .select()
        .single();

      if (error) throw error;

      setAppointmentDetails(appointment);
      toast.success(t.mrAppointment.success);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/50 to-white">
      <ResponsiveHeader />
      
      <main className="flex-grow pt-20 sm:pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <h1 className="text-xl sm:text-2xl font-semibold text-white">{t.mrAppointment.title}</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">{t.mrAppointment.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:order-2">
                  <MRAppointmentForm 
                    form={form}
                    onChange={setForm}
                    t={t.mrAppointment.form}
                  />
                </div>

                <div className="lg:order-1">
                  <MRAppointmentCalendar
                    selectedDate={form.appointment_date}
                    onDateChange={(date) => setForm({ ...form, appointment_date: date })}
                    onValidationError={(error) => toast.error(error)}
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
                {loading ? t.mrAppointment.form.submitting : t.mrAppointment.form.submit}
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      {appointmentDetails && (
        <MRAppointmentConfirmation
          appointment={appointmentDetails}
          onClose={handleClose}
          onScheduleAnother={resetForm}
          t={t.mrAppointment}
        />
      )}

      <Footer />
    </div>
  );
}
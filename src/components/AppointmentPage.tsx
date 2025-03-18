import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { AppointmentForm } from './AppointmentForm';
import { BookingConfirmation } from './BookingConfirmation';
import { AppointmentForm as AppointmentFormType, BookingDetails as BookingDetailsType, TimeSlot } from '../types';
import { generateTimeSlots, validateBookingRequest } from '../utils';
import { useTranslation } from '../i18n/useTranslation';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

export function AppointmentPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsType | null>(null);
  
  // Get today's date in IST
  const today = new Date();
  const istToday = utcToZonedTime(today, TIMEZONE);
  const istTodayStr = format(istToday, 'yyyy-MM-dd');

  const initialForm = {
    name: '',
    phone: '',
    age: '',
    city: '',
    date: istTodayStr,
    timeSlot: ''
  };

  const [form, setForm] = useState<AppointmentFormType>(initialForm);

  const resetForm = () => {
    setForm(initialForm);
    setSuccess(false);
    setBookingDetails(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isValid, error } = await validateBookingRequest(
        form.phone,
        form.date,
        form.timeSlot
      );

      if (!isValid) {
        throw new Error(error);
      }

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          name: form.name,
          phone: form.phone,
          age: parseInt(form.age),
          city: form.city,
          appointment_date: form.date,
          appointment_time: form.timeSlot,
          status: 'pending'
        })
        .select()
        .single();

      if (appointmentError) throw new Error(appointmentError.message);

      setSuccess(true);
      setBookingDetails(appointment);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <h1 className="text-xl sm:text-2xl font-semibold text-white">{t.appointment.title}</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">{t.appointment.form.subtitle}</p>
            </div>

            <div className="p-4 sm:p-6">
              <AppointmentForm
                form={form}
                setForm={setForm}
                timeSlots={timeSlots}
                onSubmit={handleSubmit}
                success={success}
                loading={loading}
              />
            </div>
          </motion.div>
        </div>
      </main>

      {bookingDetails && (
        <BookingConfirmation
          booking={bookingDetails}
          onClose={() => setBookingDetails(null)}
          onScheduleAnother={resetForm}
        />
      )}

      <Footer />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Notice, AppointmentForm as AppointmentFormType, BookingDetails as BookingDetailsType, TimeSlot } from '../types';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { BookingConfirmation } from './appointment/BookingConfirmation';
import { generateTimeSlots, validateBookingRequest } from '../utils';
import { toast } from 'react-hot-toast';
import { HeroSection } from './landing/HeroSection';
import { ServicesSection } from './landing/ServicesSection';
import { NoticeBoard } from './landing/NoticeBoard';
import { StatsSection } from './landing/StatsSection';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useTranslation } from '../i18n/useTranslation';
import { motion } from 'framer-motion';
import { AppointmentForm } from './appointment/AppointmentForm';
import { useIsMobile } from '../hooks/useIsMobile';

export function LandingPage() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsType | null>(null);
  
  // Get today's date in IST
  const today = new Date();
  const istToday = utcToZonedTime(today, 'Asia/Kolkata');
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

  useEffect(() => {
    loadNotices();
  }, []);

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (form.date) {
        setLoadingSlots(true);
        try {
          const slots = await generateTimeSlots(form.date);
          setTimeSlots(slots);
        } catch (error: unknown) {
          console.error('Error loading time slots:', error);
          toast.error('Failed to load available time slots');
          setTimeSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      } else {
        setTimeSlots([]);
      }
    };

    loadTimeSlots();
  }, [form.date]);

  const loadNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('active', true)
        .order('order', { ascending: true });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error loading notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setSuccess(false);
    setBookingDetails(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);

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
      // Reset form after successful booking
      setForm(initialForm);
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <ResponsiveHeader />
      
      <HeroSection t={t.home.hero} disableAnimations={isMobile} />
      
      {/* Appointment Form Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isMobile ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">{t.appointment.title}</h2>
              </div>
              <div className="p-4 sm:p-6">
                <AppointmentForm
                  form={form}
                  setForm={setForm}
                  timeSlots={timeSlots}
                  onSubmit={handleSubmit}
                  success={success}
                  loading={bookingLoading}
                  loadingSlots={loadingSlots}
                />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">{t.appointment.title}</h2>
              </div>
              <div className="p-4 sm:p-6">
                <AppointmentForm
                  form={form}
                  setForm={setForm}
                  timeSlots={timeSlots}
                  onSubmit={handleSubmit}
                  success={success}
                  loading={bookingLoading}
                  loadingSlots={loadingSlots}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <ServicesSection t={t.services} disableAnimations={isMobile} />
      <NoticeBoard notices={notices} loading={loading} disableAnimations={isMobile} />
      <StatsSection t={t.home.stats} disableAnimations={isMobile} />

      {bookingDetails && (
        <BookingConfirmation
          booking={bookingDetails}
          onClose={() => {
            setBookingDetails(null);
            setSuccess(false);
          }}
          onScheduleAnother={resetForm}
        />
      )}

      <Footer />
    </div>
  );
}
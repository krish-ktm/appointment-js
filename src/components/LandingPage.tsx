import { useState, useEffect, lazy, Suspense } from 'react';
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
import { AppointmentForm } from './appointment/AppointmentForm';
import { motion, useReducedMotion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

// Lazy load sections that are below the fold
const LazyServicesSection = lazy(() => import('./landing/ServicesSection').then(module => ({ default: module.ServicesSection })));
const LazyNoticeBoard = lazy(() => import('./landing/NoticeBoard').then(module => ({ default: module.NoticeBoard })));
const LazyStatsSection = lazy(() => import('./landing/StatsSection').then(module => ({ default: module.StatsSection })));

export function LandingPage() {
  const { t } = useTranslation();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsType | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  
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
      setForm(initialForm);
      
      // Reload time slots to reflect the new booking
      loadTimeSlots();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // Animation variants optimized for performance
  const sectionVariants = {
    hidden: { 
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Loading placeholder for lazy-loaded sections
  const LoadingPlaceholder = () => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <ResponsiveHeader />
      
      <HeroSection t={t.home.hero} />
      
      {/* Appointment Form Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </motion.div>
      
      {/* Lazy load sections below the fold */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <LazyServicesSection t={t.services} />
        </motion.div>
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <LazyNoticeBoard notices={notices} loading={loading} />
        </motion.div>
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <LazyStatsSection t={t.home.stats} />
        </motion.div>
      </Suspense>

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
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Notice, AppointmentForm as AppointmentFormType, BookingDetails as BookingDetailsType, TimeSlot } from '../types';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { BookingConfirmation } from './BookingConfirmation';
import { translations } from '../translations';
import { generateTimeSlots, validateBookingRequest } from '../utils';
import { toast } from 'react-hot-toast';
import { HeroSection } from './landing/HeroSection';
import { ServicesSection } from './landing/ServicesSection';
import { NoticeBoard } from './landing/NoticeBoard';
import { StatsSection } from './landing/StatsSection';

export function LandingPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsType | null>(null);
  
  const today = new Date();
  const istToday = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const istTodayStr = istToday.toISOString().split('T')[0];

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
        const slots = await generateTimeSlots(form.date);
        setTimeSlots(slots);
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
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <ResponsiveHeader />
      
      <HeroSection
        form={form}
        setForm={setForm}
        timeSlots={timeSlots}
        handleSubmit={handleSubmit}
        success={success}
        loading={bookingLoading}
      />
      
      <ServicesSection />
      <NoticeBoard notices={notices} loading={loading} />
      <StatsSection />

      {bookingDetails && (
        <BookingConfirmation
          booking={bookingDetails}
          onClose={() => setBookingDetails(null)}
          onScheduleAnother={resetForm}
          t={translations.en}
        />
      )}

      <Footer />
    </div>
  );
}
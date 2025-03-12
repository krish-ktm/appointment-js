import { useState, useEffect } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { AppointmentForm } from './AppointmentForm';
import { BookingConfirmation } from './BookingConfirmation';
import { translations } from '../translations';
import { Language, AppointmentForm as AppointmentFormType, BookingDetails as BookingDetailsType, TimeSlot } from '../types';
import { generateTimeSlots, validateBookingRequest } from '../utils';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export function Home() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const handleFormChange = (newForm: AppointmentFormType) => {
    setForm(newForm);
  };

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

  if (!language) {
    return <LanguageSelector onSelectLanguage={handleLanguageSelect} />;
  }

  return (
    <div>
      <AppointmentForm
        form={form}
        setForm={handleFormChange}
        timeSlots={timeSlots}
        t={translations[language]}
        onSubmit={handleSubmit}
        success={success}
        loading={loading}
      />
      {bookingDetails && (
        <BookingConfirmation
          booking={bookingDetails}
          onClose={() => setBookingDetails(null)}
          onScheduleAnother={resetForm}
          t={translations[language]}
        />
      )}
    </div>
  );
}
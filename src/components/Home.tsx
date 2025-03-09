import { useState, useEffect } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { AppointmentForm } from './AppointmentForm';
import { BookingDetails } from './BookingDetails';
import { translations } from '../translations';
import { Language, AppointmentForm as AppointmentFormType, BookingDetails as BookingDetailsType, TimeSlot } from '../types';
import { generateTimeSlots, validateBookingRequest } from '../utils';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export function Home() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsType | null>(null);
  
  // Get today's date in IST
  const today = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset (UTC+5:30)
  const istToday = new Date(today.getTime() + istOffset);
  const istTodayStr = istToday.toISOString().split('T')[0];

  const [form, setForm] = useState<AppointmentFormType>({
    name: '',
    phone: '',
    age: '',
    city: '',
    date: istTodayStr,
    timeSlot: ''
  });

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (form.date) {
        const slots = await generateTimeSlots(form.date);
        setTimeSlots(slots);

        // If no slots available for today, switch to tomorrow
        if (form.date === istTodayStr && slots.every(slot => slot.currentBookings >= slot.maxBookings)) {
          const istTomorrow = new Date(istToday);
          istTomorrow.setDate(istTomorrow.getDate() + 1);
          const istTomorrowStr = istTomorrow.toISOString().split('T')[0];
          setForm(prev => ({ ...prev, date: istTomorrowStr }));
        }
      } else {
        setTimeSlots([]);
      }
    };

    loadTimeSlots();
  }, [form.date, istTodayStr]);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const handleFormChange = (newForm: AppointmentFormType) => {
    // If date changes, reset the time slot
    if (newForm.date !== form.date) {
      newForm.timeSlot = '';
    }
    setForm(newForm);
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
      setForm({
        name: '',
        phone: '',
        age: '',
        city: '',
        date: istTodayStr,
        timeSlot: ''
      });
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
    <div className="relative">
      <div className="absolute top-4 right-4">
        <Link
          to="/login"
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Admin Login
        </Link>
      </div>
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
        <BookingDetails
          booking={bookingDetails}
          onClose={() => setBookingDetails(null)}
          t={translations[language]}
        />
      )}
    </div>
  );
}
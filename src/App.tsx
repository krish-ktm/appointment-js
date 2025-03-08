import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { translations } from './translations';
import { generateTimeSlots, validateBookingRequest } from './utils';
import { Language, TimeSlot, AppointmentForm as AppointmentFormType, BookingDetails as BookingDetailsType } from './types';
import { LanguageSelector } from './components/LanguageSelector';
import { AppointmentForm } from './components/AppointmentForm';
import { BookingDetails } from './components/BookingDetails';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { Toaster, toast } from 'react-hot-toast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/admin/login" />;
}

function BookingApp() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsType | null>(null);
  
  const [form, setForm] = useState<AppointmentFormType>({
    name: '',
    phone: '',
    age: '',
    city: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: ''
  });

  useEffect(() => {
    if (form.date) {
      const loadTimeSlots = async () => {
        const slots = await generateTimeSlots(form.date);
        setTimeSlots(slots);
      };
      loadTimeSlots();

      const interval = setInterval(loadTimeSlots, 60000);
      return () => clearInterval(interval);
    }
  }, [form.date]);

  if (!language) {
    return <LanguageSelector onSelectLanguage={setLanguage} />;
  }

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = await validateBookingRequest(form.phone, form.date, form.timeSlot);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const slot = timeSlots.find(s => s.time === form.timeSlot);
      if (!slot || slot.currentBookings >= slot.maxBookings) {
        throw new Error('This time slot is no longer available');
      }

      const { data, error } = await supabase
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

      if (error) throw error;

      setSuccess(true);
      toast.success(t.success);
      setBookingDetails(data as BookingDetailsType);
      setForm({
        name: '',
        phone: '',
        age: '',
        city: '',
        date: new Date().toISOString().split('T')[0],
        timeSlot: ''
      });
      
      const slots = await generateTimeSlots(form.date);
      setTimeSlots(slots);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <>
      <AppointmentForm
        form={form}
        setForm={setForm}
        timeSlots={timeSlots}
        t={t}
        onSubmit={handleSubmit}
        success={success}
        loading={loading}
      />
      {bookingDetails && (
        <BookingDetails
          booking={bookingDetails}
          onClose={() => setBookingDetails(null)}
          t={t}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingApp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
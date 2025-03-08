import { useState, useEffect } from 'react';
import { translations } from './translations';
import { generateTimeSlots } from './utils';
import { Language, TimeSlot, AppointmentForm as AppointmentFormType } from './types';
import { LanguageSelector } from './components/LanguageSelector';
import { AppointmentForm } from './components/AppointmentForm';
import { supabase } from './lib/supabase';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState<AppointmentFormType>({
    name: '',
    phone: '',
    age: '',
    city: '',
    date: new Date().toISOString().split('T')[0], // Set default date to today
    timeSlot: ''
  });

  useEffect(() => {
    if (form.date) {
      const loadTimeSlots = async () => {
        const slots = await generateTimeSlots(form.date);
        setTimeSlots(slots);
      };
      loadTimeSlots();

      // Refresh time slots every minute to update availability
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
      // Check if slot is still available
      const slot = timeSlots.find(s => s.time === form.timeSlot);
      if (!slot || slot.currentBookings >= slot.maxBookings) {
        throw new Error('This time slot is no longer available');
      }

      const { error } = await supabase.from('appointments').insert({
        name: form.name,
        phone: form.phone,
        age: parseInt(form.age),
        city: form.city,
        appointment_date: form.date,
        appointment_time: form.timeSlot
      });

      if (error) throw error;

      setSuccess(true);
      toast.success(t.success);
      setForm({
        name: '',
        phone: '',
        age: '',
        city: '',
        date: new Date().toISOString().split('T')[0],
        timeSlot: ''
      });
      
      // Refresh time slots
      if (form.date) {
        const slots = await generateTimeSlots(form.date);
        setTimeSlots(slots);
      }
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
      <Toaster position="top-right" />
    </>
  );
}

export default App;
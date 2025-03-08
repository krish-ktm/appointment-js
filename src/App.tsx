import { useState } from 'react';
import { translations } from './translations';
import { generateTimeSlots } from './utils';
import { Language, TimeSlot, AppointmentForm as AppointmentFormType } from './types';
import { LanguageSelector } from './components/LanguageSelector';
import { AppointmentForm } from './components/AppointmentForm';

function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState<AppointmentFormType>({
    name: '',
    phone: '',
    age: '',
    city: '',
    date: '',
    timeSlot: ''
  });

  if (!language) {
    return <LanguageSelector onSelectLanguage={setLanguage} />;
  }

  const t = translations[language];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <AppointmentForm
      form={form}
      setForm={setForm}
      timeSlots={timeSlots}
      t={t}
      onSubmit={handleSubmit}
      tomorrowStr={tomorrowStr}
      success={success}
    />
  );
}

export default App;
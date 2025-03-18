import { useState } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { AppointmentForm } from './AppointmentForm';
import { BookingConfirmation } from './BookingConfirmation';
import { translations } from '../translations';
import { Language } from '../types';
import { useAppointmentForm } from '../hooks/useAppointmentForm';

export function Home() {
  const [language, setLanguage] = useState<Language | null>(null);
  const {
    form,
    setForm,
    loading,
    success,
    timeSlots,
    bookingDetails,
    handleSubmit,
    resetForm,
    closeBookingDetails
  } = useAppointmentForm();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  if (!language) {
    return <LanguageSelector onSelectLanguage={handleLanguageSelect} />;
  }

  return (
    <div>
      <AppointmentForm
        form={form}
        setForm={setForm}
        timeSlots={timeSlots}
        t={translations[language]}
        onSubmit={handleSubmit}
        success={success}
        loading={loading}
      />
      {bookingDetails && (
        <BookingConfirmation
          booking={bookingDetails}
          onClose={closeBookingDetails}
          onScheduleAnother={resetForm}
          t={translations[language]}
        />
      )}
    </div>
  );
}
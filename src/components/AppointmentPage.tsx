import { motion } from 'framer-motion';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { AppointmentForm } from './AppointmentForm';
import { BookingConfirmation } from './BookingConfirmation';
import { useTranslation } from '../i18n/useTranslation';
import { useAppointmentForm } from '../hooks/useAppointmentForm';

export function AppointmentPage() {
  const { t } = useTranslation();
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/50 to-white">
      <ResponsiveHeader />
      
      <main className="flex-grow pt-20 sm:pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <h1 className="text-xl sm:text-2xl font-semibold text-white">{t.appointment.title}</h1>
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
          onClose={closeBookingDetails}
          onScheduleAnother={resetForm}
        />
      )}

      <Footer />
    </div>
  );
}
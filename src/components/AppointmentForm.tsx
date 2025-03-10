import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, User, Clock } from 'lucide-react';
import { AppointmentForm as AppointmentFormType, TimeSlot, Translations } from '../types';
import { FormField } from './FormField';
import { TimeSlotSelector } from './TimeSlotSelector';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface AppointmentFormProps {
  form: AppointmentFormType;
  setForm: (form: AppointmentFormType) => void;
  timeSlots: TimeSlot[];
  t: Translations;
  onSubmit: (e: React.FormEvent) => void;
  success: boolean;
  loading: boolean;
}

export function AppointmentForm({
  form,
  setForm,
  timeSlots,
  t,
  onSubmit,
  success,
  loading
}: AppointmentFormProps) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setForm({ ...form, date: date.toISOString().split('T')[0], timeSlot: '' });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl shadow-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-blue-50 rounded-xl mb-3 sm:mb-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            {t.title}
          </h2>
          <p className="text-sm text-gray-500">
            Select your preferred date and time for the appointment
          </p>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="font-medium">{t.success}</p>
            </div>
            <p className="text-sm text-green-600">We'll see you at your scheduled time!</p>
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Date and Time Selection */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{t.date}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[today, tomorrow].map((date) => (
                    <motion.button
                      key={date.toISOString()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleDateChange(date)}
                      className={`p-3 sm:p-4 rounded-xl text-center transition-all ${
                        form.date === date.toISOString().split('T')[0]
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-medium mb-1">
                        {date.toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                      <div className={`text-[10px] sm:text-xs ${form.date === date.toISOString().split('T')[0] ? 'text-blue-100' : 'text-gray-500'}`}>
                        {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{t.timeSlot}</h3>
                </div>
                <TimeSlotSelector
                  timeSlots={timeSlots}
                  selectedTime={form.timeSlot}
                  onSelectTime={(time) => setForm({ ...form, timeSlot: time })}
                  label={t.timeSlot}
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    label={t.name}
                    type="text"
                    value={form.name}
                    onChange={(value) => setForm({ ...form, name: value })}
                    icon={User}
                  />
                  <FormField
                    label={t.phone}
                    type="tel"
                    value={form.phone}
                    onChange={(value) => setForm({ ...form, phone: value })}
                    icon={Phone}
                  />
                  <FormField
                    label={t.age}
                    type="number"
                    value={form.age}
                    onChange={(value) => setForm({ ...form, age: value })}
                    icon={User}
                    min="0"
                    max="120"
                  />
                  <FormField
                    label={t.city}
                    type="text"
                    value={form.city}
                    onChange={(value) => setForm({ ...form, city: value })}
                    icon={MapPin}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || !form.timeSlot}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm sm:text-base ${
                  (loading || !form.timeSlot) ? 'opacity-70 cursor-not-allowed from-blue-400 to-blue-500' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Booking...</span>
                  </div>
                ) : (
                  t.submit
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
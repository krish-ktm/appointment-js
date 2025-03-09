import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, User } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {t.title}
            </h1>
          </motion.div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center text-sm font-medium"
            >
              {t.success}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <h2 className="text-base font-medium text-gray-900 mb-3">{t.date}</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm font-medium">
                      {t.selectTime}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[today, tomorrow].map((date) => (
                      <motion.button
                        key={date.toISOString()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleDateChange(date)}
                        className={`p-3 rounded-lg text-center transition-all border ${
                          form.date === date.toISOString().split('T')[0]
                            ? 'bg-blue-50 border-blue-600 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {date.toLocaleDateString(undefined, { weekday: 'short' })}
                        </div>
                        <div className="text-xs mt-0.5">
                          {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-base font-medium text-gray-900 mb-3">{t.timeSlot}</h2>
                <TimeSlotSelector
                  timeSlots={timeSlots}
                  selectedTime={form.timeSlot}
                  onSelectTime={(time) => setForm({ ...form, timeSlot: time })}
                  label={t.timeSlot}
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading || !form.timeSlot}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm sm:text-base ${
                    (loading || !form.timeSlot) ? 'opacity-70 cursor-not-allowed from-blue-400 to-blue-500' : ''
                  }`}
                >
                  {loading ? 'Booking...' : t.submit}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
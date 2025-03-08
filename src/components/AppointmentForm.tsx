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
  tomorrowStr: string;
  success: boolean;
}

export function AppointmentForm({
  form,
  setForm,
  timeSlots,
  t,
  onSubmit,
  tomorrowStr,
  success
}: AppointmentFormProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {t.title}
            </h1>
            <p className="text-gray-600">Schedule your consultation with our expert dermatologist</p>
          </motion.div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center font-medium"
            >
              {t.success}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
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

                <TimeSlotSelector
                  timeSlots={timeSlots}
                  selectedTime={form.timeSlot}
                  onSelectTime={(time) => setForm({ ...form, timeSlot: time })}
                  label={t.timeSlot}
                />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-lg font-medium"
                >
                  {t.submit}
                </motion.button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.date}*
                </label>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <DatePicker
                    selected={form.date ? new Date(form.date) : null}
                    onChange={(date: Date) => setForm({ ...form, date: date.toISOString().split('T')[0] })}
                    minDate={tomorrow}
                    maxDate={tomorrow}
                    inline
                    calendarClassName="!border-0 !shadow-none w-full"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
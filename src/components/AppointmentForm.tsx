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
  const nextThreeDays = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

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
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {t.title}
            </h1>
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
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Select Date (Next 3 Days Only)</h2>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <button type="button" className="text-gray-500 hover:text-gray-700">
                      <Calendar className="h-5 w-5" />
                    </button>
                    <div className="text-lg font-medium">March 2025</div>
                    <button type="button" className="text-gray-500 hover:text-gray-700">
                      <Calendar className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-sm text-gray-500">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {nextThreeDays.map((date, index) => (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => setForm({ ...form, date: date.toISOString().split('T')[0] })}
                        className={`p-2 rounded-lg text-center ${
                          form.date === date.toISOString().split('T')[0]
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Select Time</h2>
                <TimeSlotSelector
                  timeSlots={timeSlots}
                  selectedTime={form.timeSlot}
                  onSelectTime={(time) => setForm({ ...form, timeSlot: time })}
                  label={t.timeSlot}
                />
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  disabled={loading}
                  className={`w-full py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-lg font-medium ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
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
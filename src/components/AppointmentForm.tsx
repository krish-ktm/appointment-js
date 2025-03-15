import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, User, Clock } from 'lucide-react';
import { AppointmentForm as AppointmentFormType, TimeSlot } from '../types';
import { FormField } from './FormField';
import { TimeSlotSelector } from './TimeSlotSelector';
import { useTranslation } from '../i18n/useTranslation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface AppointmentFormProps {
  form: AppointmentFormType;
  setForm: (form: AppointmentFormType) => void;
  timeSlots: TimeSlot[];
  onSubmit: (e: React.FormEvent) => void;
  success: boolean;
  loading: boolean;
}

const TIMEZONE = 'Asia/Kolkata';

export function AppointmentForm({
  form,
  setForm,
  timeSlots,
  onSubmit,
  success,
  loading
}: AppointmentFormProps) {
  const { t } = useTranslation();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const istDate = utcToZonedTime(date, TIMEZONE);
      const formattedDate = format(istDate, 'yyyy-MM-dd');
      setForm({ ...form, date: formattedDate, timeSlot: '' });
    }
  };

  // Format the selected date for display
  const formatSelectedDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="relative p-4 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl border border-gray-200">
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
            {t.appointment.title}
          </h2>
          <p className="text-sm text-gray-500">
            {t.appointment.form.subtitle}
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
              <p className="font-medium">{t.appointment.form.success}</p>
            </div>
            <p className="text-sm text-green-600">{t.appointment.form.successNote}</p>
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Date and Time Selection */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{t.appointment.form.date}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[today, tomorrow].map((date) => {
                    const istDate = utcToZonedTime(date, TIMEZONE);
                    const dateStr = format(istDate, 'yyyy-MM-dd');
                    return (
                      <motion.button
                        key={dateStr}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleDateChange(date)}
                        className={`p-3 sm:p-4 rounded-xl text-center transition-all ${
                          form.date === dateStr
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-medium mb-1">
                          {format(istDate, 'EEE')}
                        </div>
                        <div className={`text-[10px] sm:text-xs ${form.date === dateStr ? 'text-blue-100' : 'text-gray-500'}`}>
                          {format(istDate, 'MMM d')}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t.appointment.form.timeSlot}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t.appointment.form.showingSlots}: {formatSelectedDate(form.date)}
                    </p>
                  </div>
                </div>
                <TimeSlotSelector
                  timeSlots={timeSlots}
                  selectedTime={form.timeSlot}
                  onSelectTime={(time) => setForm({ ...form, timeSlot: time })}
                  label={t.appointment.form.timeSlot}
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{t.appointment.form.personalInfo}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    label={t.appointment.form.name}
                    type="text"
                    value={form.name}
                    onChange={(value) => setForm({ ...form, name: value })}
                    icon={User}
                  />
                  <FormField
                    label={t.appointment.form.phone}
                    type="tel"
                    value={form.phone}
                    onChange={(value) => setForm({ ...form, phone: value })}
                    icon={Phone}
                  />
                  <FormField
                    label={t.appointment.form.age}
                    type="number"
                    value={form.age}
                    onChange={(value) => setForm({ ...form, age: value })}
                    icon={User}
                    min="0"
                    max="120"
                  />
                  <FormField
                    label={t.appointment.form.city}
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
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base ${
                  (loading || !form.timeSlot) ? 'opacity-70 cursor-not-allowed bg-blue-400' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t.appointment.form.booking}</span>
                  </div>
                ) : (
                  t.appointment.form.submit
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
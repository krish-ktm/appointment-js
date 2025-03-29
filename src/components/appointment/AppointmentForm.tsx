import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, User, Clock, AlertCircle } from 'lucide-react';
import { AppointmentForm as AppointmentFormType, TimeSlot } from '../../types';
import { FormField } from './FormField';
import { TimeSlotSelector } from './TimeSlotSelector';
import { useTranslation } from '../../i18n/useTranslation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatMarkdown } from '../../utils/markdown';

interface AppointmentFormProps {
  form: AppointmentFormType;
  setForm: (form: AppointmentFormType) => void;
  timeSlots: TimeSlot[];
  onSubmit: (e: React.FormEvent) => void;
  success: boolean;
  loading: boolean;
  loadingSlots?: boolean;
}

const TIMEZONE = 'Asia/Kolkata';

export function AppointmentForm({
  form,
  setForm,
  timeSlots,
  onSubmit,
  success,
  loading,
  loadingSlots = false
}: AppointmentFormProps) {
  const { t, language } = useTranslation();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [rules, setRules] = useState<any[]>([]);
  const [showAllRules, setShowAllRules] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_rules')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error loading rules:', error);
    }
  };

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
    const dayName = t.appointment.form.days[format(date, 'EEEE').toLowerCase() as keyof typeof t.appointment.form.days];
    const monthName = t.appointment.form.months[format(date, 'MMMM').toLowerCase() as keyof typeof t.appointment.form.months];
    const day = format(date, 'd');
    const year = format(date, 'yyyy');
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const displayedRules = showAllRules ? rules : rules.slice(0, 2);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6 sm:mb-8"
      >
        <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-blue-50 rounded-xl mb-3 sm:mb-4">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
        <p className="text-sm text-gray-500">
          {t.appointment.form.subtitle}
        </p>
      </motion.div>

      {/* Appointment Rules */}
      {rules.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-6 space-y-2"
        >
          {rules.length > 2 && (
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowAllRules(!showAllRules)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {showAllRules ? 'Show Less' : 'Show All'}
              </button>
            </div>
          )}
          {displayedRules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-blue-50/50 rounded-lg p-2.5 border border-blue-100 hover:shadow-sm hover:border-blue-200 transition-all duration-300"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {rule.title[language]}
                </h4>
                <div 
                  className="prose prose-sm max-w-none text-xs text-gray-600 mt-0.5 leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:my-0 prose-p:my-0.5"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMarkdown(rule.content[language]) 
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

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
                  const dayName = t.appointment.form.days[format(istDate, 'EEEE').toLowerCase() as keyof typeof t.appointment.form.days];
                  const monthName = t.appointment.form.months[format(istDate, 'MMMM').toLowerCase() as keyof typeof t.appointment.form.months];
                  const day = format(istDate, 'd');
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
                        {dayName}
                      </div>
                      <div className={`text-[10px] sm:text-xs ${form.date === dateStr ? 'text-blue-100' : 'text-gray-500'}`}>
                        {`${monthName} ${day}`}
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
                t={t.appointment.form}
                loading={loadingSlots}
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
    </div>
  );
}

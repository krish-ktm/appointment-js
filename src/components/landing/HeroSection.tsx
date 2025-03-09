import { motion } from 'framer-motion';
import { AppointmentForm } from '../AppointmentForm';
import { AppointmentFormType, TimeSlot } from '../../types';
import { translations } from '../../translations';
import { gradients, background, text, button } from '../../theme/colors';

interface HeroSectionProps {
  form: AppointmentFormType;
  setForm: (form: AppointmentFormType) => void;
  timeSlots: TimeSlot[];
  handleSubmit: (e: React.FormEvent) => void;
  success: boolean;
  loading: boolean;
}

export function HeroSection({ form, setForm, timeSlots, handleSubmit, success, loading }: HeroSectionProps) {
  return (
    <div className={`relative bg-gradient-to-br ${gradients.primary.light} ${text.light} min-h-screen`}>
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-32 lg:py-40">
          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              ✨ Your Journey to Radiant Skin Starts Here
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            >
              Expert Skin Care for Your Health & Beauty
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-xl ${text.lightMuted} mb-8 leading-relaxed`}
            >
              Professional dermatological care with personalized treatment plans for all your skin concerns.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-emerald-300"></div>
                <span className="text-sm font-medium">Expert Dermatologists</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-amber-300"></div>
                <span className="text-sm font-medium">Advanced Treatments</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-rose-300"></div>
                <span className="text-sm font-medium">Personalized Care</span>
              </div>
            </motion.div>
          </div>

          {/* Appointment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-5xl mt-12 appointment-form-section"
            id="appointment-form"
          >
            <div className="bg-white/20 backdrop-blur-md p-1 rounded-2xl">
              <div className="bg-white rounded-xl shadow-xl">
                <AppointmentForm
                  form={form}
                  setForm={setForm}
                  timeSlots={timeSlots}
                  t={translations.en}
                  onSubmit={handleSubmit}
                  success={success}
                  loading={loading}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
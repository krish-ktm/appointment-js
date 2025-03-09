import { motion } from 'framer-motion';
import { AppointmentForm } from '../AppointmentForm';
import { AppointmentFormType, TimeSlot, BookingDetailsType } from '../../types';
import { translations } from '../../translations';

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
    <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-12 lg:py-20">
          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              ✨ Your Journey to Radiant Skin Starts Here
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 leading-tight"
            >
              Expert Skin Care for Your Health & Beauty
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-purple-100 mb-8 leading-relaxed"
            >
              Professional dermatological care with personalized treatment plans for all your skin concerns.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium">Expert Dermatologists</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                <span className="text-sm font-medium">Advanced Treatments</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-pink-400"></div>
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
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl">
              <div className="bg-white rounded-xl shadow-2xl">
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
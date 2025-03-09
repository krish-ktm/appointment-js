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
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12">
          <div className="text-center lg:text-center max-w-3xl mx-auto">
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
              className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
            >
              Expert Skin Care for Your Health & Beauty
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-purple-100 mb-8"
            >
              Professional dermatological care with personalized treatment plans for all your skin concerns.
            </motion.p>
          </div>
          <div className="bg-transparent max-w-3xl mx-auto w-full">
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
      </div>
    </div>
  );
}
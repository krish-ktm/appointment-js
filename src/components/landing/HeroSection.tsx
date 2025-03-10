import { motion } from 'framer-motion';
import { AppointmentForm } from '../AppointmentForm';
import { AppointmentFormType, TimeSlot } from '../../types';
import { translations } from '../../translations';
import { text } from '../../theme/colors';

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
    <div className="relative min-h-screen bg-white/30">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center pt-20 pb-12 sm:py-32 lg:py-40">
          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group mb-4 sm:mb-6 inline-block"
            >
              <div className="relative bg-white/40 backdrop-blur-lg px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium shadow-lg border border-white/40 hover:border-white/60 transition-all duration-300 overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                  <span className="text-base sm:text-lg">✨</span>
                  <span className="text-blue-900">
                    Your Journey to Radiant Skin Starts Here
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-blue-950"
            >
              Expert Skin Care for Your Health & Beauty
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-blue-800 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0"
            >
              Professional dermatological care with personalized treatment plans for all your skin concerns.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-4"
            >
              {[
                {
                  icon: "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400",
                  text: "Expert Dermatologists",
                  color: "text-emerald-600"
                },
                {
                  icon: "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-400",
                  text: "Advanced Treatments",
                  color: "text-amber-600"
                },
                {
                  icon: "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-rose-400",
                  text: "Personalized Care",
                  color: "text-rose-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="relative bg-white/40 backdrop-blur-lg px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg border border-white/40 hover:border-white/60 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                      <div className={`${feature.icon}`}></div>
                      <span className={`text-xs sm:text-sm font-medium ${feature.color}`}>
                        {feature.text}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Appointment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-5xl mt-8 sm:mt-12 appointment-form-section"
            id="appointment-form"
          >
            <div className="bg-white/40 backdrop-blur-lg p-1 rounded-xl sm:rounded-2xl border border-white/40">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-xl">
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
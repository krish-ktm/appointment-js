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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group mb-6 inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-md px-6 py-3 rounded-xl text-sm font-medium shadow-lg border border-white/40 group-hover:border-white/60 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <span className="text-lg">✨</span>
                  <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Your Journey to Radiant Skin Starts Here
                  </span>
                </div>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              </div>
            </motion.div>

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
              {[
                {
                  icon: "h-2 w-2 rounded-full bg-emerald-400",
                  text: "Expert Dermatologists",
                  gradient: "from-emerald-500 to-emerald-600"
                },
                {
                  icon: "h-2 w-2 rounded-full bg-amber-400",
                  text: "Advanced Treatments",
                  gradient: "from-amber-500 to-amber-600"
                },
                {
                  icon: "h-2 w-2 rounded-full bg-rose-400",
                  text: "Personalized Care",
                  gradient: "from-rose-500 to-rose-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/40 group-hover:border-white/60 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={feature.icon}></div>
                      <span className={`text-sm font-medium bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                        {feature.text}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
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
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
  // Optimize animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen bg-white/30">
      {/* Pattern background with reduced opacity and optimized rendering */}
      <div 
        className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"
        style={{ 
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }} 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col items-center pt-32 sm:pt-40 pb-12 sm:pb-32 lg:pb-40"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ staggerChildren: 0.1 }}
          style={{ 
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="relative group mb-4 sm:mb-6 inline-block"
              style={{ 
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="relative bg-white/40 backdrop-blur-[8px] px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium shadow-lg border border-white/40 hover:border-white/60 transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg">✨</span>
                  <span className="text-blue-900">
                    Your Journey to Radiant Skin Starts Here
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-blue-950"
              style={{ 
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              Expert Skin Care for Your Health & Beauty
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-blue-800 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0"
              style={{ 
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              Professional dermatological care with personalized treatment plans for all your skin concerns.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-2 sm:gap-4"
              style={{ 
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
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
                <div
                  key={index}
                  className="relative group"
                  style={{ 
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <div className="relative bg-white/40 backdrop-blur-[8px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg border border-white/40 hover:border-white/60 transition-all duration-300">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`${feature.icon}`} />
                      <span className={`text-xs sm:text-sm font-medium ${feature.color}`}>
                        {feature.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Appointment Form */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-5xl mt-8 sm:mt-12 appointment-form-section"
            id="appointment-form"
            style={{ 
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="bg-white/40 backdrop-blur-[8px] p-1 rounded-xl sm:rounded-2xl border border-white/40">
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
        </motion.div>
      </div>
    </div>
  );
}
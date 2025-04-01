import { motion } from 'framer-motion';
import { Building2, ArrowRight, Star, Award, Shield, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  t: {
    title: string;
    subtitle: string;
    doctorTitle: string;
    experience: string;
    advancedTreatments: string;
    expertCare: string;
    mrAppointmentCta: string;
    mrAppointmentNote: string;
  };
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/gallery/doctor-office.JPG)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90" />
      </div>

      {/* Floating Shapes Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center pt-24 sm:pt-32 pb-12 sm:pb-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left lg:pr-12 mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Calendar className="h-5 w-5 text-blue-300 mr-2" />
              <span className="text-sm font-medium text-white">{t.doctorTitle}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              {t.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {t.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
            >
              {[
                {
                  icon: Star,
                  text: t.experience,
                  color: "text-emerald-400"
                },
                {
                  icon: Award,
                  text: t.advancedTreatments,
                  color: "text-amber-400"
                },
                {
                  icon: Shield,
                  text: t.expertCare,
                  color: "text-rose-400"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="relative p-1"
                >
                  <div className="relative bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                      <span className="text-sm font-medium text-white">
                        {feature.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Doctor Image - Visible only on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:hidden mb-8"
            >
              <img
                src="/gallery/doctor.png"
                alt="Doctor"
                className="w-full max-w-md mx-auto"
                style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
              />
            </motion.div>

            {/* MR Appointment Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block"
            >
              <Link
                to="/mr-appointment"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 border border-white/20 transition-all duration-300 text-sm"
              >
                <Building2 className="h-5 w-5" />
                <span>{t.mrAppointmentCta}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="mt-2 text-xs text-blue-200">
                {t.mrAppointmentNote}
              </p>
            </motion.div>
          </div>

          {/* Doctor Image - Visible only on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:block relative"
            style={{ 
              width: '500px',
              minHeight: '600px'
            }}
          >
            <div className="absolute right-0 bottom-0" style={{ zIndex: 1 }}>
              <img
                src="/gallery/doctor.png"
                alt="Doctor"
                className="max-h-[650px] object-contain"
                style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
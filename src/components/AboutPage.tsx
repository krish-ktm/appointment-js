import { motion } from 'framer-motion';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { Clock, MapPin, Phone, Award, Star, Shield, Calendar, CheckCircle2, Building2, Users, Stethoscope } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export function AboutPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2B5C4B]/5 to-white">
      <ResponsiveHeader />
      
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-[#2B5C4B] mb-16">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B5C4B] to-[#234539] mix-blend-multiply" />
              <div className="absolute inset-0 bg-[#2B5C4B]/20" />
            </div>

            <div className="relative">
              <div className="p-8 sm:p-12 lg:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto text-center space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
                    <Shield className="w-3.5 h-3.5" />
                    {t.about.experience}
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {t.about.title}
                  </h1>

                  <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                    {t.about.subtitle}
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      {
                        icon: Star,
                        text: t.about.qualification,
                        color: "from-emerald-400 to-emerald-500"
                      },
                      {
                        icon: Award,
                        text: t.about.yearsExperience,
                        color: "from-amber-400 to-amber-500"
                      },
                      {
                        icon: Shield,
                        text: t.about.specialization,
                        color: "from-rose-400 to-rose-500"
                      }
                    ].map((feature, index) => (
                      <div 
                        key={index} 
                        className="relative p-1"
                      >
                        <div className="relative bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                          <div className="flex items-center gap-3">
                            <feature.icon className={`h-4 w-4 text-white`} />
                            <span className="text-sm font-medium text-white">
                              {feature.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Clinic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-16"
          >
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                {t.about.clinicName}
              </h2>
              <p className="text-sm sm:text-base text-white/90">
                {t.about.clinicDescription}
              </p>
            </div>
            
            <div className="p-6 sm:p-8 space-y-8">
              {/* Contact & Location */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.about.location}</p>
                      <p className="text-base text-gray-900">{t.about.address}</p>
                    </div>
                  </div>
                  <a
                    href="tel:+917947131573"
                    className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.about.contact}</p>
                      <p className="text-base text-gray-900">{t.about.phone}</p>
                    </div>
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl">
                      <Clock className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <p className="font-medium text-gray-900">{t.about.openingHours}</p>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>{t.about.weekdayHours}</p>
                    <p>{t.about.saturdayHours}</p>
                    <p>{t.about.sundayHours}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.about.amenities}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {t.about.amenitiesList.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#2B5C4B] flex-shrink-0" />
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-[#2B5C4B] rounded-2xl p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {t.about.cta.title}
              </h3>
              <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                {t.about.cta.description}
              </p>
              <button
                onClick={() => {
                  const element = document.querySelector('.appointment-form-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#appointment-form';
                  }
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#2B5C4B] rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:shadow text-base sm:text-lg font-medium gap-2 group"
              >
                {t.about.cta.button}
                <Calendar className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
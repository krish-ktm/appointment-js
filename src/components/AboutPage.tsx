import { motion } from 'framer-motion';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { Clock, MapPin, Phone, Award, Star, Shield, Calendar, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export function AboutPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <ResponsiveHeader />
      
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-10 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4"
            >
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2" />
              <span className="text-xs sm:text-sm font-medium text-blue-600">{t.about.experience}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-tight text-blue-950"
            >
              {t.about.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base sm:text-xl text-blue-800 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0"
            >
              {t.about.subtitle}
            </motion.p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                {
                  icon: Star,
                  text: t.about.qualification,
                  color: "text-emerald-600"
                },
                {
                  icon: Award,
                  text: t.about.yearsExperience,
                  color: "text-amber-600"
                },
                {
                  icon: Shield,
                  text: t.about.specialization,
                  color: "text-rose-600"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="relative p-1"
                  style={{ contain: 'content' }}
                >
                  <div className="relative bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <feature.icon className={`h-4 w-4 ${feature.color}`} />
                      <span className={`text-sm font-medium ${feature.color}`}>
                        {feature.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-10 sm:mb-16"
          >
            <div className="p-4 sm:p-8 bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                {t.about.clinicName}
              </h2>
              <p className="text-sm sm:text-base text-blue-100">
                {t.about.clinicDescription}
              </p>
            </div>
            
            <div className="p-4 sm:p-8 space-y-6">
              {/* Contact & Location */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">{t.about.location}</p>
                      <p className="text-sm sm:text-base text-gray-900">{t.about.address}</p>
                    </div>
                  </div>
                  <a
                    href="tel:+917947131573"
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">{t.about.contact}</p>
                      <p className="text-sm sm:text-base text-gray-900">{t.about.phone}</p>
                    </div>
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{t.about.openingHours}</p>
                  </div>
                  <div className="space-y-2 text-sm sm:text-base">
                    <p className="text-gray-600">{t.about.weekdayHours}</p>
                    <p className="text-gray-600">{t.about.saturdayHours}</p>
                    <p className="text-gray-600">{t.about.sundayHours}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{t.about.amenities}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {t.about.amenitiesList.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-600">{amenity}</span>
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
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl sm:rounded-2xl p-6 sm:p-12">
              <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                {t.about.cta.title}
              </h3>
              <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
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
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow text-base sm:text-lg font-medium"
              >
                {t.about.cta.button}
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
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
      
      <main className="pt-20 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-10 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4"
            >
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2" />
              <span className="text-xs sm:text-sm font-medium text-blue-600">14 Years of Excellence</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4"
            >
              Dr. Jemish A. Patel
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-4"
            >
              MBBS, MD - Dermatologist, Cosmetic Surgeon & Trichologist
            </motion.p>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {[
              {
                icon: Award,
                title: "Qualification",
                description: "MBBS MD - Saurashtra University (2008)"
              },
              {
                icon: Calendar,
                title: "Experience",
                description: "14 Years in Healthcare"
              },
              {
                icon: Shield,
                title: "Specialization",
                description: "Dermatology & Cosmetic Surgery"
              },
              {
                icon: Star,
                title: "Expertise",
                description: "Skin, Hair & Laser Treatments"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-blue-50 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Clinic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-10 sm:mb-16"
          >
            <div className="p-4 sm:p-8 bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                Shubham Skin and Laser Clinic
              </h2>
              <p className="text-sm sm:text-base text-blue-100">
                State-of-the-art dermatology and cosmetic surgery center
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
                      <p className="text-xs sm:text-sm text-gray-500">Location</p>
                      <p className="text-sm sm:text-base text-gray-900">Mehsana Industrial Estate, Mehsana, Gujarat</p>
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
                      <p className="text-xs sm:text-sm text-gray-500">Contact</p>
                      <p className="text-sm sm:text-base text-gray-900">+91 79471 31573</p>
                    </div>
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Opening Hours</p>
                  </div>
                  <div className="space-y-2 text-sm sm:text-base">
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 1:00 PM | 4:00 PM - 6:30 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Amenities & Accessibility</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {[
                    "Wheelchair accessible entrance",
                    "Wheelchair accessible restroom",
                    "Gender-neutral restroom",
                    "Modern equipment",
                    "Comfortable waiting area",
                    "Digital payment accepted"
                  ].map((amenity, index) => (
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
                Ready to Transform Your Skin Health?
              </h3>
              <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Experience personalized dermatological care with cutting-edge treatments tailored to your needs.
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
                Book an Appointment
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
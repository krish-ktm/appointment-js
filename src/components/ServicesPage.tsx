import { motion } from 'framer-motion';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { Stethoscope, Zap, FlaskRound as Flask, Microscope, Scissors, Heart } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

interface ServiceCategory {
  title: string;
  icon: any;
  services: string[];
}

export function ServicesPage() {
  const { t } = useTranslation();

  const serviceCategories: ServiceCategory[] = [
    {
      title: t.services.categories.treatments,
      icon: Heart,
      services: [
        "Permanent Hair Removal",
        "Fractional Skin Rejuvenation",
        "Bacterial Skin Infection",
        "Keloid And Scar",
        "Allergy",
        "Androgenetic Alopecia",
        "Contact Dermatitis",
        "Nail Disorder",
        "Freckles",
        "Fractional CO2 Laser Skin Resurfacing",
        "Melasma",
        "Alopecia Areata (Patchy Hair Loss)",
        "Permanent Hair Removal Diode Laser",
        "Vitiligo"
      ]
    },
    {
      title: t.services.categories.facial,
      icon: Stethoscope,
      services: [
        "Retinol Peel",
        "Skin Care",
        "Chemical Peel Treatment",
        "Pigmentation",
        "Photofacial",
        "Facial Rejuvenation",
        "Glycolic Peel Facial",
        "Facial",
        "Radiance Rejuvenating Cocoa Facial",
        "Facial Wrinkles"
      ]
    },
    {
      title: t.services.categories.aesthetic,
      icon: Zap,
      services: [
        "Line and Wrinkle Smoothing",
        "Aesthetic Dermatology Consultation",
        "Dark Spots",
        "Skin hair and Nail disorder",
        "Micro Needling"
      ]
    },
    {
      title: t.services.categories.surgical,
      icon: Scissors,
      services: [
        "Subcision",
        "Skin Grafting for Vitiligo",
        "Laser Resurfacing"
      ]
    },
    {
      title: t.services.categories.hair,
      icon: Flask,
      services: [
        "Hair Care",
        "Laser Hair Treatment - Face",
        "Laser Hair Removal"
      ]
    },
    {
      title: t.services.categories.diagnostic,
      icon: Microscope,
      services: [
        "Dermoscopy",
        "Radiocautery"
      ]
    }
  ];

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
              className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full mb-4"
            >
              <Heart className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600">Expert Care</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
            >
              {t.services.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0"
            >
              {t.services.subtitle}
            </motion.p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {serviceCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-blue-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {category.title}
                      </h2>
                    </div>
                    
                    <ul className="space-y-2 sm:space-y-3">
                      {category.services.map((service, serviceIndex) => (
                        <motion.li
                          key={service}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: categoryIndex * 0.1 + serviceIndex * 0.05 }}
                          className="flex items-center gap-2 sm:gap-3"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0"></span>
                          <span className="text-sm sm:text-base text-gray-600">{service}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 sm:mt-16 text-center px-4 sm:px-0"
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                {t.services.cta.title}
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                {t.services.cta.subtitle}
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
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow text-base sm:text-lg font-medium"
              >
                {t.services.cta.button}
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
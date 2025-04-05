import { motion } from 'framer-motion';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { Stethoscope, Zap, FlaskRound as Flask, Microscope, Scissors, Heart, Shield, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { Link } from 'react-router-dom';

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
      services: t.services.lists.treatments
    },
    {
      title: t.services.categories.facial,
      icon: Stethoscope,
      services: t.services.lists.facial
    },
    {
      title: t.services.categories.aesthetic,
      icon: Zap,
      services: t.services.lists.aesthetic
    },
    {
      title: t.services.categories.surgical,
      icon: Scissors,
      services: t.services.lists.surgical
    },
    {
      title: t.services.categories.hair,
      icon: Flask,
      services: t.services.lists.hair
    },
    {
      title: t.services.categories.diagnostic,
      icon: Microscope,
      services: t.services.lists.diagnostic
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2B5C4B]/5 via-white to-[#2B5C4B]/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl" />
      </div>

      <ResponsiveHeader />
      
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              {t.services.expertCare}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5c] mb-4 sm:mb-6"
            >
              {t.services.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0"
            >
              {t.services.subtitle}
            </motion.p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {serviceCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#2B5C4B]/20 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2B5C4B]/0 via-[#2B5C4B]/0 to-[#2B5C4B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-[#2B5C4B]/5 p-3 rounded-xl group-hover:bg-[#2B5C4B]/10 transition-colors duration-300">
                        <Icon className="h-6 w-6 text-[#2B5C4B]" />
                      </div>
                      <h2 className="text-xl font-semibold text-[#1e3a5c] group-hover:text-[#2B5C4B] transition-colors duration-300">
                        {category.title}
                      </h2>
                    </div>
                    
                    <ul className="space-y-3">
                      {category.services.map((service, serviceIndex) => (
                        <motion.li
                          key={service}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: categoryIndex * 0.1 + serviceIndex * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2B5C4B]" />
                          <span className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                            {service}
                          </span>
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 sm:mt-20"
          >
            <div className="bg-[#2B5C4B] rounded-2xl p-8 sm:p-12 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
              </div>

              <div className="relative">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {t.services.cta.title}
                </h3>
                <p className="text-white/80 text-base sm:text-lg mb-8 max-w-2xl">
                  {t.services.cta.subtitle}
                </p>
                <Link
                  to="/appointment"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2B5C4B] rounded-xl hover:bg-gray-50 transition-colors shadow-lg shadow-black/10 font-medium group"
                >
                  {t.services.cta.button}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
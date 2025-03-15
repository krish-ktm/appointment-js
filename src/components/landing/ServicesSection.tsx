import { motion } from 'framer-motion';
import { Star, Award, Users, Zap, FlaskRound as Flask, Microscope, ArrowRight } from 'lucide-react';
import { background, text, border, gradients } from '../../theme/colors';
import { Link } from 'react-router-dom';

const services = [
  {
    title: "General Dermatology",
    icon: Star,
    description: "Comprehensive skin health examinations and treatment for various skin conditions.",
    features: [
      "Skin Disease Treatment",
      "Allergy Management",
      "Bacterial Infections",
      "Nail Disorders"
    ]
  },
  {
    title: "Cosmetic Procedures",
    icon: Award,
    description: "Advanced treatments to enhance your skin's appearance and health.",
    features: [
      "Laser Treatments",
      "Chemical Peels",
      "Skin Rejuvenation",
      "Anti-aging Solutions"
    ]
  },
  {
    title: "Specialized Care",
    icon: Users,
    description: "Expert care for specific skin conditions and concerns.",
    features: [
      "Vitiligo Treatment",
      "Hair Loss Solutions",
      "Scar Management",
      "Pigmentation Treatment"
    ]
  },
  {
    title: "Advanced Treatments",
    icon: Zap,
    description: "State-of-the-art procedures using the latest technology.",
    features: [
      "Fractional CO2 Laser",
      "Permanent Hair Removal",
      "Photofacial",
      "Micro Needling"
    ]
  },
  {
    title: "Hair Services",
    icon: Flask,
    description: "Comprehensive solutions for all types of hair concerns.",
    features: [
      "Hair Loss Treatment",
      "Scalp Conditions",
      "Hair Growth Therapy",
      "Laser Hair Removal"
    ]
  },
  {
    title: "Diagnostic Services",
    icon: Microscope,
    description: "Advanced diagnostic tools for accurate treatment planning.",
    features: [
      "Dermoscopy",
      "Skin Analysis",
      "Allergy Testing",
      "Treatment Planning"
    ]
  }
];

export function ServicesSection() {
  return (
    <div className={`py-20 bg-gradient-to-b ${background.light} will-change-transform`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.primary}`}>
            Our Services
          </h2>
          <p className={`text-lg ${text.secondary} max-w-2xl mx-auto`}>
            Comprehensive dermatological care with advanced treatments and personalized solutions for all your skin health needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`bg-white/80 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 ${border.accent} ${border.accentHover} backdrop-blur-sm will-change-transform`}
                style={{ contain: 'content' }}
              >
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-violet-500" />
                </div>
                <h3 className={`text-xl font-semibold ${text.primary} mb-3`}>
                  {service.title}
                </h3>
                <p className={`${text.secondary} mb-4`}>
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-300 shadow-sm hover:shadow"
          >
            <span className="font-medium">View All Services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
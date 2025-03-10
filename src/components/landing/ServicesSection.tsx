import { motion } from 'framer-motion';
import { Star, Award, Users } from 'lucide-react';
import { background, text, border, gradients } from '../../theme/colors';

const services = [
  {
    title: 'General Dermatology',
    description: 'Comprehensive skin health examinations and treatment for various conditions.',
    icon: Star
  },
  {
    title: 'Cosmetic Procedures',
    description: "Advanced treatments to enhance your skin's appearance and health.",
    icon: Award
  },
  {
    title: 'Skin Cancer Screening',
    description: 'Early detection and prevention of skin cancer through thorough screenings.',
    icon: Users
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
            We offer a comprehensive range of dermatological services to help you achieve and maintain healthy, beautiful skin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <p className={text.secondary}>
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
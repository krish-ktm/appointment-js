import { motion } from 'framer-motion';
import { Star, Award, Shield, Stethoscope, Clock, Users } from 'lucide-react';

interface WhyChooseUsSectionProps {
  t: {
    title: string;
    subtitle: string;
    reasons: {
      experience: string;
      expertise: string;
      technology: string;
      care: string;
      timing: string;
      patients: string;
    };
    descriptions: {
      experience: string;
      expertise: string;
      technology: string;
      care: string;
      timing: string;
      patients: string;
    };
  };
}

export function WhyChooseUsSection({ t }: WhyChooseUsSectionProps) {
  const reasons = [
    {
      icon: Star,
      title: t.reasons.experience,
      description: t.descriptions.experience,
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Award,
      title: t.reasons.expertise,
      description: t.descriptions.expertise,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Shield,
      title: t.reasons.technology,
      description: t.descriptions.technology,
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Stethoscope,
      title: t.reasons.care,
      description: t.descriptions.care,
      color: "from-rose-500 to-rose-600"
    },
    {
      icon: Clock,
      title: t.reasons.timing,
      description: t.descriptions.timing,
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Users,
      title: t.reasons.patients,
      description: t.descriptions.patients,
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${reason.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {reason.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUsSection;
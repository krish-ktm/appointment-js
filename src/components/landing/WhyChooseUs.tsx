import { motion } from 'framer-motion';
import { Shield, Stethoscope, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WhyChooseUsProps {
  t: any;
}

const MotionLink = motion(Link);

export function WhyChooseUs({ t }: WhyChooseUsProps) {
  const features = [
    {
      icon: Shield,
      title: "Personalized, compassionate care",
      description: "We believe that every patient is unique. That's why we take the time to understand your specific needs and tailor treatment plans.",
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-50"
    },
    {
      icon: Stethoscope,
      title: "Comprehensive care for all skin needs",
      description: "Whether you're seeking medical dermatology, cosmetic treatments, or preventive care, we offer a comprehensive range of services.",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Clock,
      title: "Advanced treatments & technology",
      description: "Our clinic is equipped with the latest technology and our team stays up-to-date with advanced treatment methods.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs sm:text-sm font-medium mb-4 sm:mb-6"
            >
              <Shield className="w-4 h-4" />
              Why Choose Us
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-[1.2]"
            >
              Why choose us for all your dermatology needs
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 leading-relaxed"
            >
              We're dedicated to helping you achieve and maintain beautiful, healthy skin. Trust us to provide exceptional care tailored to you.
            </motion.p>

            <div className="space-y-6 sm:space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex gap-4 sm:gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg shadow-gray-200/50 group-hover:shadow-xl transition-shadow duration-300`}>
                      <feature.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <MotionLink
              to="/appointment"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2B5C4B] text-white rounded-xl mt-8 sm:mt-12 hover:bg-[#234539] transition-colors shadow-lg shadow-[#2B5C4B]/10 hover:shadow-xl hover:shadow-[#2B5C4B]/20"
            >
              Book an Appointment
              <ArrowRight className="w-4 h-4" />
            </MotionLink>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative lg:ml-12 mt-8 lg:mt-0"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50">
              <img
                src="https://images.unsplash.com/photo-1612776572997-76cc42e058c3?q=80&w=1200"
                alt="Dermatology Treatment"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-[#2B5C4B]/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-8 -left-8 w-72 h-72 bg-[#2B5C4B]/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
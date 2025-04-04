import { motion } from 'framer-motion';
import { Users, Stethoscope, Shield, Leaf } from 'lucide-react';

interface BenefitsProps {
  t: any;
}

export function Benefits({ t }: BenefitsProps) {
  const benefits = [
    {
      title: "Expert Dermatologists",
      description: "Our team consists of board-certified dermatologists with extensive experience",
      icon: Users
    },
    {
      title: "Advanced Technology",
      description: "We use cutting-edge equipment and innovative techniques",
      icon: Stethoscope
    },
    {
      title: "High Safety Standards",
      description: "Your safety is our priority. We adhere to strict hygiene and safety protocols",
      icon: Shield
    },
    {
      title: "Personalized Care",
      description: "Every treatment plan is tailored to your unique skin type and concerns",
      icon: Leaf
    }
  ];

  return (
    <section className="relative py-12 md:py-16 bg-[#2B5C4B] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 md:w-64 h-32 md:h-64 opacity-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full border-[20px] md:border-[40px] border-white/20 rounded-full"
        />
      </div>
      <div className="absolute bottom-0 right-0 w-48 md:w-96 h-48 md:h-96 opacity-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full h-full border-[30px] md:border-[60px] border-white/20 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium mb-3 backdrop-blur-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            Our Benefits
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-marcellus text-white mb-3 md:mb-4"
          >
            Exceptional dermatology,<br className="hidden sm:block" /> every step of the way
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-sm md:text-base max-w-2xl mx-auto"
          >
            Experience personalized care, advanced treatments, and visible results with our expert dermatology services.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-center">
          {/* Center Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-start-2 row-span-2 order-first lg:order-none mb-6 md:mb-0"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-4 md:border-8 border-white/10 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1595831004082-7d028af1387b?q=80&w=1974&auto=format&fit=crop"
                alt="Dermatologist"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B5C4B]/50 to-transparent"></div>
            </div>
          </motion.div>

          {/* Benefits List */}
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: index < 2 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <benefit.icon className="w-8 h-8 md:w-10 md:h-10 text-white/80 mb-3" />
                <h3 className="text-lg md:text-xl font-marcellus text-white mb-1 md:mb-2">
                  {benefit.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
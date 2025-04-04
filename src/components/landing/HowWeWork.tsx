import { motion } from 'framer-motion';
import { Phone, ArrowRight, Shield } from 'lucide-react';

interface HowWeWorkProps {
  t: any;
}

export function HowWeWork({ t }: HowWeWorkProps) {
  const steps = [
    {
      number: "01",
      title: "Personalized Consultation",
      description: "Our expert dermatologists begin with a thorough assessment of your skin concerns and medical history to understand your unique needs."
    },
    {
      number: "02",
      title: "Tailored Treatment Plans",
      description: "We develop a comprehensive treatment strategy using advanced dermatological techniques and technologies customized for optimal results."
    },
    {
      number: "03",
      title: "Continuous Care & Follow-Up",
      description: "Our commitment extends beyond treatment with regular follow-ups and adjustments to ensure lasting skin health improvements."
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Content */}
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm">
                <Shield className="w-3.5 h-3.5" />
                How We Work
              </span>

              <h2 className="text-3xl md:text-4xl font-marcellus text-emerald-900 leading-tight mb-4 md:mb-6">
                How we work: a commitment to your skin health
              </h2>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 md:mb-16 max-w-xl">
                We're dedicated to helping you achieve and maintain beautiful, healthy skin. Trust us to provide exceptional care tailored to you.
              </p>

              <div className="space-y-8 md:space-y-12">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="group relative"
                  >
                    <div className="flex gap-4 md:gap-8 items-start">
                      <div className="text-3xl md:text-4xl font-marcellus text-emerald-800/40 font-light">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-marcellus text-emerald-900 mb-2 md:mb-3 group-hover:text-emerald-700 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-emerald-200/60 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <div className="lg:sticky lg:top-8 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl shadow-emerald-900/10">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=2940&h=3500"
                alt="Dermatology Treatment"
                className="w-full h-[400px] md:h-[700px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
                <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20">
                  <h4 className="text-2xl md:text-3xl font-marcellus text-white mb-3 md:mb-4">
                    Have Questions? We're Here to Help You!
                  </h4>
                  <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
                    Schedule your consultation today and take the first step towards healthier skin.
                  </p>
                  <a
                    href="tel:(123) 456 789"
                    className="inline-flex items-center gap-2 md:gap-3 text-base md:text-lg text-white hover:text-emerald-200 transition-colors group"
                  >
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    (123) 456 789
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
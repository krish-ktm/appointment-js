import { motion } from 'framer-motion';
import { gradients, text } from '../../theme/colors';

export function StatsSection() {
  return (
    <div className={`py-20 bg-gradient-to-b ${gradients.primary.light} will-change-transform`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.primary}`}>
            Our Impact
          </h2>
          <p className={`text-lg ${text.secondary} max-w-2xl mx-auto`}>
            Delivering exceptional dermatological care and transforming lives through expertise and dedication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              value: '10+', 
              label: 'Years Experience',
              gradient: 'from-blue-600 to-blue-400'
            },
            { 
              value: '15k+', 
              label: 'Happy Patients',
              gradient: 'from-emerald-600 to-emerald-400'
            },
            { 
              value: '50+', 
              label: 'Treatments',
              gradient: 'from-violet-600 to-violet-400'
            },
            { 
              value: '99%', 
              label: 'Satisfaction Rate',
              gradient: 'from-amber-600 to-amber-400'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
              style={{ willChange: 'transform', contain: 'content' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/40 group-hover:border-white/60 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                <div className="relative z-10">
                  <div className={`text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className={`${text.secondary} font-medium`}>
                    {stat.label}
                  </div>
                </div>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
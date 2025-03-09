import { motion } from 'framer-motion';
import { gradients, text } from '../../theme/colors';

export function StatsSection() {
  return (
    <div className={`bg-gradient-to-r ${gradients.primary.dark} ${text.light} py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
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
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:border-white/40 transition-colors duration-300">
                <div className="flex flex-col items-center">
                  <div className={`text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base font-medium text-center">
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
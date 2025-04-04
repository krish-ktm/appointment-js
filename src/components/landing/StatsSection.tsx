import { motion } from 'framer-motion';
import { gradients, text } from '../../theme/colors';

interface StatsSectionProps {
  t: any; // Using any for now, but we should define proper type
}

export function StatsSection({ t }: StatsSectionProps) {
  return (
    <div className={`py-20 bg-gradient-to-b ${gradients.primary.light} will-change-transform`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            { 
              value: '14+', 
              label: t.yearsExperience,
              gradient: 'from-blue-600 to-blue-400',
              description: t.experienceDesc
            },
            { 
              value: '15k+', 
              label: t.happyPatients,
              gradient: 'from-emerald-600 to-emerald-400',
              description: t.patientsDesc
            },
            { 
              value: '50+', 
              label: t.treatments,
              gradient: 'from-violet-600 to-violet-400',
              description: t.treatmentsDesc
            },
            { 
              value: '99%', 
              label: t.successRate,
              gradient: 'from-amber-600 to-amber-400',
              description: t.successDesc
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-1.5"
              style={{ willChange: 'transform', contain: 'content' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/20 rounded-2xl blur-xl opacity-70"></div>
              <div className="relative bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-white/40 hover:border-white/60 transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                <div className="relative z-10">
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className={`${text.secondary} font-medium text-sm sm:text-base mb-2`}>
                    {stat.label}
                  </div>
                  <p className="text-xs text-gray-500">
                    {stat.description}
                  </p>
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
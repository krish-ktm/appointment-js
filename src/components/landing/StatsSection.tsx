import { motion } from 'framer-motion';
import { Calendar, Users, Star, Award } from 'lucide-react';
import React from 'react';

interface StatsSectionProps {
  t: {
    yearsExperience: string;
    happyPatients: string;
    treatments: string;
    successRate: string;
    experienceDesc: string;
    patientsDesc: string;
    treatmentsDesc: string;
    successDesc: string;
  };
  disableAnimations?: boolean;
}

interface StatCardProps {
  stat: {
    name: string;
    value: number;
    icon: React.ElementType;
    description: string;
    suffix: string;
    gradient: string;
  };
  index: number;
}

export function StatsSection({ t, disableAnimations = false }: StatsSectionProps) {
  const stats = [
    {
      name: t.yearsExperience,
      value: 25,
      icon: Calendar,
      description: t.experienceDesc,
      suffix: "+",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      name: t.happyPatients,
      value: 8500,
      icon: Users,
      description: t.patientsDesc,
      suffix: "+",
      gradient: "from-emerald-500 to-emerald-700"
    },
    {
      name: t.treatments,
      value: 12,
      icon: Star,
      description: t.treatmentsDesc,
      suffix: "+",
      gradient: "from-amber-500 to-amber-700"
    },
    {
      name: t.successRate,
      value: 98,
      icon: Award,
      description: t.successDesc,
      suffix: "%",
      gradient: "from-rose-500 to-rose-700"
    }
  ];

  const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
    const Icon = stat.icon;
    
    if (disableAnimations) {
      return (
        <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden group">
          <div 
            className={`absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-10 bg-gradient-to-r ${stat.gradient}`} 
          />
          
          <div className="flex items-start">
            <div className={`p-3 rounded-full mr-4 bg-gradient-to-r ${stat.gradient}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            
            <div>
              <div className="flex items-end">
                <span className="text-4xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-xl font-bold text-gray-900 mb-1 ml-1">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            {stat.description}
          </p>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden group"
      >
        <motion.div 
          className={`absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-10 bg-gradient-to-r ${stat.gradient}`} 
          whileHover={{ scale: 1.2, opacity: 0.2 }}
          transition={{ duration: 0.5 }}
        />
        
        <div className="flex items-start">
          <div className={`p-3 rounded-full mr-4 bg-gradient-to-r ${stat.gradient}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          <div>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-900">
                {stat.value}
              </span>
              <span className="text-xl font-bold text-gray-900 mb-1 ml-1">
                {stat.suffix}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          {stat.description}
        </p>
      </motion.div>
    );
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
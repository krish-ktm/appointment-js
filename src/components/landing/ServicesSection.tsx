import { Star, Award, Users, Zap, FlaskRound as Flask, Microscope, ArrowRight } from 'lucide-react';
import { background, text, border, gradients } from '../../theme/colors';
import { Link } from 'react-router-dom';
import React from 'react';

interface ServiceTranslation {
  title: string;
  subtitle: string;
  viewAll: string;
  categories: {
    treatments: string;
    facial: string;
    aesthetic: string;
    surgical: string;
    hair: string;
    diagnostic: string;
  };
  lists: {
    treatments: string[];
    facial: string[];
    aesthetic: string[];
    surgical: string[];
    hair: string[];
    diagnostic: string[];
  };
}

interface ServicesSectionProps {
  t: ServiceTranslation;
}

interface ServiceItemProps {
  service: {
    title: string;
    icon: React.ElementType;
    description: string;
    features: string[];
  };
}

const ServiceItem = ({ service }: ServiceItemProps) => {
  const Icon = service.icon;
  
  return (
    <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 group">
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-8 w-8 text-violet-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
        {service.title}
      </h3>
      <p className="text-gray-600 mb-6 line-clamp-2">
        {service.description}
      </p>
      <ul className="space-y-3">
        {service.features.map((feature: string, featureIndex: number) => (
          <li key={featureIndex} className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function ServicesSection({ t }: ServicesSectionProps) {
  const services = [
    {
      title: t.categories.treatments,
      icon: Star,
      description: t.lists.treatments[0],
      features: t.lists.treatments.slice(1, 5)
    },
    {
      title: t.categories.facial,
      icon: Award,
      description: t.lists.facial[0],
      features: t.lists.facial.slice(1, 5)
    },
    {
      title: t.categories.aesthetic,
      icon: Users,
      description: t.lists.aesthetic[0],
      features: t.lists.aesthetic.slice(1, 5)
    },
    {
      title: t.categories.surgical,
      icon: Zap,
      description: t.lists.surgical[0],
      features: t.lists.surgical.slice(1)
    },
    {
      title: t.categories.hair,
      icon: Flask,
      description: t.lists.hair[0],
      features: t.lists.hair.slice(1)
    },
    {
      title: t.categories.diagnostic,
      icon: Microscope,
      description: t.lists.diagnostic[0],
      features: t.lists.diagnostic.slice(1)
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
          {services.map((service) => (
            <ServiceItem
              key={service.title}
              service={service}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/services"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <span className="font-medium text-lg">{t.viewAll}</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
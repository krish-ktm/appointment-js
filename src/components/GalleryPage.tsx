import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { useTranslation } from '../i18n/useTranslation';
import { Camera, Building2, Users, Layout } from 'lucide-react';
import { galleryImages, categories } from '../config/gallery';

// Hero section translations
const heroText = {
  en: {
    badge: "Clinic Gallery",
    title: "Take a Tour of Our Clinic",
    description: "Explore our modern facilities and comfortable environment designed for your care"
  },
  gu: {
    badge: "ક્લિનિક ગેલેરી",
    title: "અમારી ક્લિનિકની મુલાકાત લો",
    description: "તમારી સંભાળ માટે ડિઝાઇન કરેલી અમારી આધુનિક સુવિધાઓ અને આરામદાયક વાતાવરણની ઝલક જુઓ"
  }
};

export function GalleryPage() {
  const { language } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const categoryList = categories[language];
  const getCategoryIcon = (id: string) => {
    switch(id) {
      case 'all': return Camera;
      case 'office': return Users;
      case 'interior': return Layout;
      case 'exterior': return Building2;
      default: return Camera;
    }
  };

  // Get hero text based on current language
  const hero = heroText[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <ResponsiveHeader />
      
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-10 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full mb-4"
            >
              <Camera className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600">{hero.badge}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
            >
              {hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0"
            >
              {hero.description}
            </motion.p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categoryList.map(category => {
              const Icon = getCategoryIcon(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title[language]}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {image.title[language]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {image.description[language]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

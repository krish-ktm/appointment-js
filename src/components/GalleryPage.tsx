import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { useTranslation } from '../i18n/useTranslation';
import { Camera, Building2, Users, Layout, Shield } from 'lucide-react';
import { galleryImages, categories } from '../config/gallery';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2B5C4B]/5 to-white">
      <ResponsiveHeader />
      
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-[#2B5C4B] mb-16">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B5C4B] to-[#234539] mix-blend-multiply" />
              <div className="absolute inset-0 bg-[#2B5C4B]/20" />
            </div>

            <div className="relative">
              <div className="p-8 sm:p-12 lg:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto text-center space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
                    <Shield className="w-3.5 h-3.5" />
                    Our Gallery
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Take a Virtual Tour of Our Modern Clinic
                  </h1>

                  <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                    Experience our state-of-the-art facilities and comfortable environment designed for your care and comfort.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categoryList.map((category, index) => {
              const Icon = getCategoryIcon(category.id);
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                    ${selectedCategory === category.id
                      ? 'bg-[#2B5C4B] text-white shadow-lg shadow-[#2B5C4B]/10'
                      : 'bg-white text-gray-600 hover:bg-[#2B5C4B]/5 border border-gray-200'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{category.label}</span>
                </motion.button>
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
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#2B5C4B]/20 transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title[language]}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {image.title[language]}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {image.description[language]}
                    </p>
                  </div>
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
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClinicGallerySectionProps {
  t: {
    title: string;
    subtitle: string;
    viewAll: string;
  };
}

export function ClinicGallerySection({ t }: ClinicGallerySectionProps) {
  // Featured gallery images
  const featuredImages = [
    {
      src: '/gallery/doctor-office.JPG',
      alt: 'Doctor Office'
    },
    {
      src: '/gallery/reception.JPG',
      alt: 'Reception Area'
    },
    {
      src: '/gallery/waiting-area.JPG',
      alt: 'Waiting Area'
    },
    {
      src: '/gallery/interior-1.JPG',
      alt: 'Interior View'
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full mb-4"
          >
            <Camera className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">{t.title}</span>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {featuredImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group overflow-hidden rounded-2xl shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md text-sm font-medium"
          >
            {t.viewAll}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ClinicGallerySection;
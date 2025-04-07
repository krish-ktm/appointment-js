import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { background, text, gradients } from '../../theme/colors';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface ServicesSectionProps {
  t: {
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
      [key: string]: string;
    };
    lists: {
      treatments: string[];
      facial: string[];
      aesthetic: string[];
      surgical: string[];
      hair: string[];
      diagnostic: string[];
      [key: string]: string[];
    };
  };
}

interface Service {
  title: string;
  description: string;
  features: string[];
  image: string;
}

export function ServicesSection({ t }: ServicesSectionProps) {
  const services: Service[] = [
    {
      title: t.categories.treatments,
      description: t.lists.treatments[0],
      features: t.lists.treatments.slice(1, 5),
      image: "https://images.unsplash.com/photo-1612776572997-76cc42e058c3?q=80&w=1200"
    },
    {
      title: t.categories.facial,
      description: t.lists.facial[0],
      features: t.lists.facial.slice(1, 5),
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200"
    },
    {
      title: t.categories.aesthetic,
      description: t.lists.aesthetic[0],
      features: t.lists.aesthetic.slice(1, 5),
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1200"
    },
    {
      title: t.categories.surgical,
      description: t.lists.surgical[0],
      features: t.lists.surgical.slice(1),
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200"
    },
    {
      title: t.categories.hair,
      description: t.lists.hair[0],
      features: t.lists.hair.slice(1),
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1200"
    },
    {
      title: t.categories.diagnostic,
      description: t.lists.diagnostic[0],
      features: t.lists.diagnostic.slice(1),
      image: "https://images.unsplash.com/photo-1579684288538-c76a2fab9617?q=80&w=1200"
    }
  ];

  return (
    <div className={`py-16 sm:py-20 bg-gradient-to-b ${background.light} will-change-transform`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.primary} font-heading`}>
            {t.title}
          </h2>
          <p className={`text-base sm:text-lg ${text.secondary} max-w-2xl mx-auto px-4 font-sans`}>
            {t.subtitle}
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={32}
            centeredSlides={true}
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              }
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'bg-[#2B5C4B] w-4',
              bulletClass: 'w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300 mx-1 cursor-pointer'
            }}
            className="!pb-8"
          >
            {services.map((service) => (
              <SwiperSlide key={service.title} className="!w-[280px] sm:!w-[340px] md:!w-[400px]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C4532]/95 via-[#1C4532]/50 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end">
                      <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <div className="w-6 h-6 text-white">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2 font-heading">
                        {service.title}
                      </h3>
                      <p className="text-white/80 text-sm line-clamp-2 font-sans">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center mt-4 sm:mt-6 px-4">
          <Link
            to="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2B5C4B] text-white rounded-xl hover:bg-[#234539] transition-all duration-300 shadow-sm hover:shadow font-sans"
          >
            <span className="font-medium">{t.viewAll}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
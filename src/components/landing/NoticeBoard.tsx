import { motion } from 'framer-motion';
import { Notice } from '../../types';
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslation } from '../../i18n/useTranslation';
import { formatMarkdown } from '../../utils/markdown';

interface NoticeBoardProps {
  notices: Notice[];
  loading: boolean;
}

export function NoticeBoard({ notices, loading }: NoticeBoardProps) {
  const { language } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const getLocalizedContent = (content: string | { en: string; gu: string }) => {
    if (typeof content === 'string') return content;
    return content[language] || content.en;
  };

  return (
    <div className="py-20 bg-gradient-to-b from-[#2B5C4B]/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm"
          >
            <Bell className="w-3.5 h-3.5" />
            Latest Updates
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-serif text-[#1e3a5c] mb-3 md:mb-4"
          >
            Important Announcements
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto"
          >
            Stay informed about clinic updates, special services, and important notices
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          {notices.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-[#2B5C4B]/5 rounded-2xl backdrop-blur-sm"
            >
              <Bell className="h-8 w-8 text-[#2B5C4B] mx-auto mb-3" />
              <p className="text-gray-600">No announcements at the moment.</p>
            </motion.div>
          ) : (
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {notices.map((notice, index) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-[0_0_100%] min-w-0 px-4"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#2B5C4B]/10 hover:shadow-xl transition-all duration-300">
                      {notice.images && notice.images.length > 0 && (
                        <div className="relative w-full aspect-[2/1] overflow-hidden">
                          <img
                            src={notice.images[0]}
                            alt={getLocalizedContent(notice.title)}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                      )}
                      
                      <div className="p-6 md:p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#2B5C4B] transition-colors">
                          {getLocalizedContent(notice.title)}
                        </h3>

                        {notice.content && (
                          <div 
                            className="prose prose-sm md:prose-base prose-green max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMarkdown(getLocalizedContent(notice.content)) 
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Carousel Navigation */}
              <div className="flex justify-center gap-2 mt-8">
                {notices.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedIndex === index
                        ? 'bg-[#2B5C4B] w-4'
                        : 'bg-[#2B5C4B]/20 hover:bg-[#2B5C4B]/40'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
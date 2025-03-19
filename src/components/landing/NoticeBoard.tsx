import { motion } from 'framer-motion';
import { Notice } from '../../types';
import { background, text, gradients } from '../../theme/colors';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface NoticeBoardProps {
  notices: Notice[];
  loading: boolean;
}

export function NoticeBoard({ notices, loading }: NoticeBoardProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      const date = utcToZonedTime(new Date(dateStr), 'Asia/Kolkata');
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <div className={`py-20 bg-gradient-to-b ${background.light} will-change-transform`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4"
          >
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Important Updates</span>
          </motion.div>
          <h2 className={`text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.primary}`}>
            Latest Announcements
          </h2>
          <p className={`text-lg ${text.secondary} max-w-2xl mx-auto`}>
            Stay informed about important updates, schedule changes, and announcements from Dr. Skin Care.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {notices.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-gray-50 rounded-2xl"
            >
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className={text.muted}>No announcements at the moment.</p>
            </motion.div>
          ) : (
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex">
                {notices.map((notice, index) => (
                  <div key={notice.id} className="flex-[0_0_100%] min-w-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 mx-4"
                    >
                      {notice.images && notice.images.length > 0 && (
                        <div className="relative w-full aspect-[2/1] overflow-hidden bg-gray-100">
                          <img
                            src={notice.images[0]}
                            alt={notice.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <Bell className="h-5 w-5 text-blue-500" />
                            </div>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              New Update
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(notice.created_at)}
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {notice.title}
                        </h3>

                        {notice.content && (
                          <div className="prose prose-blue max-w-none">
                            <p className="text-gray-600 leading-relaxed">
                              {notice.content}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {notices.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      emblaApi?.selectedScrollSnap() === index
                        ? 'bg-blue-600 w-4'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
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
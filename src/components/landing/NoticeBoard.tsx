import { motion, useAnimation } from 'framer-motion';
import { Notice } from '../../types';
import { background, text, gradients } from '../../theme/colors';
import { Bell, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useState, useEffect, useRef } from 'react';

interface NoticeBoardProps {
  notices: Notice[];
  loading: boolean;
}

export function NoticeBoard({ notices, loading }: NoticeBoardProps) {
  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), 'Asia/Kolkata');
    return format(date, 'MMM d, yyyy');
  };

  // Image carousel state for each notice
  const [activeImages, setActiveImages] = useState<Record<string, number>>({});
  const intervalRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const carouselRefs = useRef<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    // Initialize active image index for each notice
    const initialActiveImages: Record<string, number> = {};
    notices.forEach(notice => {
      if (notice.images && notice.images.length > 0) {
        initialActiveImages[notice.id] = 0;
      }
    });
    setActiveImages(initialActiveImages);

    // Set up auto-scroll for each notice with multiple images
    notices.forEach(notice => {
      if (notice.images && notice.images.length > 1) {
        intervalRefs.current[notice.id] = setInterval(() => {
          setActiveImages(prev => ({
            ...prev,
            [notice.id]: (prev[notice.id] + 1) % notice.images!.length
          }));
        }, 5000); // Change image every 5 seconds
      }
    });

    // Cleanup intervals on unmount
    return () => {
      Object.values(intervalRefs.current).forEach(interval => clearInterval(interval));
    };
  }, [notices]);

  const handleImageTransition = (noticeId: string, index: number) => {
    // Clear existing interval
    if (intervalRefs.current[noticeId]) {
      clearInterval(intervalRefs.current[noticeId]);
    }

    // Update active image
    setActiveImages(prev => ({ ...prev, [noticeId]: index }));

    // Reset interval
    if (notices.find(n => n.id === noticeId)?.images?.length! > 1) {
      intervalRefs.current[noticeId] = setInterval(() => {
        setActiveImages(prev => ({
          ...prev,
          [noticeId]: (prev[noticeId] + 1) % notices.find(n => n.id === noticeId)?.images?.length!
        }));
      }, 5000);
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
            <div className="space-y-8">
              {notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {notice.images && notice.images.length > 0 && (
                    <div className="relative w-full aspect-[2/1] overflow-hidden bg-gray-100">
                      <div
                        ref={el => {
                          if (el) carouselRefs.current[notice.id] = el;
                        }}
                        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${activeImages[notice.id] * 100}%)`,
                        }}
                      >
                        {notice.images.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="w-full h-full flex-shrink-0"
                          >
                            <img
                              src={image}
                              alt={`${notice.title} - ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                      {notice.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {notice.images.map((_, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={() => handleImageTransition(notice.id, imgIndex)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                activeImages[notice.id] === imgIndex
                                  ? 'bg-white scale-125'
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              aria-label={`Go to image ${imgIndex + 1}`}
                            />
                          ))}
                        </div>
                      )}
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
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(notice.created_at)}
                      </div>
                    </div>

                    <motion.h3 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="text-xl font-semibold text-gray-900 mb-3"
                    >
                      {notice.title}
                    </motion.h3>

                    {notice.content && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="prose prose-blue max-w-none"
                      >
                        <p className="text-gray-600 leading-relaxed">
                          {notice.content}
                        </p>
                      </motion.div>
                    )}

                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="mt-6 pt-6 border-t border-gray-100"
                    >
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-blue-600 mr-2">Note:</span>
                        This update is effective immediately
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
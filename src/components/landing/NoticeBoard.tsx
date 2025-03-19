import { motion, useAnimation } from 'framer-motion';
import { Notice } from '../../types';
import { background, text, gradients } from '../../theme/colors';
import { Bell, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useState, useEffect, useRef } from 'react';

interface NoticeBoardProps {
  notices: Notice[];
  loading: boolean;
}

export function NoticeBoard({ notices, loading }: NoticeBoardProps) {
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout>();

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

  const nextNotice = () => {
    if (isTransitioning || notices.length <= 1) return;
    setIsTransitioning(true);
    setCurrentNoticeIndex((prev) => (prev + 1) % notices.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevNotice = () => {
    if (isTransitioning || notices.length <= 1) return;
    setIsTransitioning(true);
    setCurrentNoticeIndex((prev) => (prev - 1 + notices.length) % notices.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    if (notices.length > 1) {
      autoPlayRef.current = setInterval(nextNotice, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [notices.length, isTransitioning]);

  // Reset current index if it's out of bounds
  useEffect(() => {
    if (currentNoticeIndex >= notices.length) {
      setCurrentNoticeIndex(0);
    }
  }, [notices.length, currentNoticeIndex]);

  const currentNotice = notices[currentNoticeIndex];

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
            <div className="relative">
              {notices.length > 1 && (
                <>
                  <button
                    onClick={prevNotice}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
                    disabled={isTransitioning}
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={nextNotice}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
                    disabled={isTransitioning}
                  >
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              )}
              
              {currentNotice && (
                <motion.div
                  key={currentNoticeIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {currentNotice.images && currentNotice.images.length > 0 && (
                    <div className="relative w-full aspect-[2/1] overflow-hidden bg-gray-100">
                      <img
                        src={currentNotice.images[0]}
                        alt={currentNotice.title}
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
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(currentNotice.created_at)}
                      </div>
                    </div>

                    <motion.h3 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="text-xl font-semibold text-gray-900 mb-3"
                    >
                      {currentNotice.title}
                    </motion.h3>

                    {currentNotice.content && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="prose prose-blue max-w-none"
                      >
                        <p className="text-gray-600 leading-relaxed">
                          {currentNotice.content}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Carousel Indicators */}
              {notices.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {notices.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isTransitioning) {
                          setIsTransitioning(true);
                          setCurrentNoticeIndex(index);
                          setTimeout(() => setIsTransitioning(false), 500);
                        }
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentNoticeIndex
                          ? 'bg-blue-600 w-4'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      disabled={isTransitioning}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
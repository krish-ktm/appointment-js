import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Bell } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useDoctorMessage } from '../contexts/DoctorMessageContext';
import { useTranslation } from '../i18n/useTranslation';

export function DoctorMessage() {
  const { message, loading, isVisible, setIsVisible } = useDoctorMessage();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const getMessageText = () => {
    if (!message) return '';
    
    if (language === 'gu' && message.message_gu) {
      return message.message_gu;
    }
    
    return message.message_en;
  };

  if (loading || !message) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-4 right-4 z-40"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#2B5C4B] to-[#234539] rounded-2xl shadow-[0_8px_30px_rgb(43,92,75,0.25)] overflow-hidden border border-white/10 backdrop-blur-sm">
              {/* Decorative Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              </div>

              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 100%"
                }}
              />
              
              <div className="relative px-6 py-4">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="relative flex-shrink-0 bg-gradient-to-br from-white/20 to-white/5 p-3 rounded-xl backdrop-blur-sm overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="h-6 w-6 text-white relative z-10" />
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 2, opacity: 0.5 }}
                      transition={{ duration: 0.5 }}
                      style={{ originX: 0.5, originY: 0.5 }}
                    />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-sm font-medium text-white mb-1 flex items-center gap-2">
                        {t.doctorMessage.title}
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Sparkles className="h-4 w-4 text-white/90" />
                        </motion.div>
                      </h3>
                      <p 
                        className="text-white/90 text-base leading-relaxed"
                        dir={language === 'gu' ? 'auto' : 'ltr'}
                      >
                        {getMessageText()}
                      </p>
                    </motion.div>
                  </div>
                  
                  <motion.button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 -mt-1 -mr-2 p-2 rounded-lg hover:bg-white/10 transition-colors group relative overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close message"
                  >
                    <X className="h-5 w-5 text-white/90 relative z-10" />
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 2, opacity: 0.5 }}
                      transition={{ duration: 0.5 }}
                      style={{ originX: 0.5, originY: 0.5 }}
                    />
                  </motion.button>
                </div>
              </div>
              
              {/* Animated progress bar */}
              <div className="relative h-1 overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 via-white/20 to-white/10"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
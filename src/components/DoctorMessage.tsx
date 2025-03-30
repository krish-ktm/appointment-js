import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useDoctorMessage } from '../contexts/DoctorMessageContext';

export function DoctorMessage() {
  const { message, loading, isVisible, setIsVisible } = useDoctorMessage();
  const { language } = useLanguage();

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-4 right-4 z-40"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-white backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-purple-100">
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20"
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
                    className="flex-shrink-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 p-3 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-sm font-medium text-purple-600 mb-1 flex items-center gap-2">
                        Alert
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
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                      </h3>
                      <p 
                        className="text-gray-700 text-base leading-relaxed"
                        dir={language === 'gu' ? 'auto' : 'ltr'}
                      >
                        {getMessageText()}
                      </p>
                    </motion.div>
                  </div>
                  
                  <motion.button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 -mt-1 -mr-2 p-2 rounded-lg hover:bg-black/5 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close message"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </motion.button>
                </div>
              </div>
              
              {/* Animated progress bar without auto-dismiss */}
              <motion.div 
                className="h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
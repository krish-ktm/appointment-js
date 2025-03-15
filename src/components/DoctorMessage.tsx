import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { MessageCircle, X } from 'lucide-react';

interface DoctorMessage {
  id: string;
  message: string;
  active: boolean;
  created_at: string;
}

export function DoctorMessage() {
  const [message, setMessage] = useState<DoctorMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    loadMessage();
  }, []);

  const loadMessage = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_messages')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      setMessage(data && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error loading doctor message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !message) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-medium text-white line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close message"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Bottom gradient line */}
              <div className="h-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { MessageCircle } from 'lucide-react';

interface DoctorMessage {
  id: string;
  message: string;
  active: boolean;
  created_at: string;
}

export function DoctorMessage() {
  const [message, setMessage] = useState<DoctorMessage | null>(null);
  const [loading, setLoading] = useState(true);

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
      
      // Set the first message if available, otherwise null
      setMessage(data && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error loading doctor message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !message) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 z-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <MessageCircle className="h-5 w-5" />
          </div>
          <p className="text-sm sm:text-base font-medium">
            {message.message}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
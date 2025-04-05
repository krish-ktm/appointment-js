import { Check, Calendar, Clock, User, Phone, MapPin, X, Download } from 'lucide-react';
import { BookingDetails } from '../../types';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useTranslation } from '../../i18n/useTranslation';
import { downloadAppointmentImage } from '../../utils/imageDownload';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const TIMEZONE = 'Asia/Kolkata';

interface BookingConfirmationProps {
  booking: BookingDetails;
  onClose: () => void;
  onScheduleAnother: () => void;
}

export function BookingConfirmation({ booking, onClose, onScheduleAnother }: BookingConfirmationProps) {
  const { t, language } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [customRulesText, setCustomRulesText] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomRules = async () => {
      try {
        const { data, error } = await supabase
          .from('image_download_rules')
          .select('content')
          .eq('type', 'patient')
          .eq('is_active', true)
          .order('order', { ascending: true })
          .limit(1)
          .single();

        if (error) throw error;
        
        if (data && data.content && data.content[language]) {
          const contentText = data.content[language] as string;
          const ruleLines = contentText.split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line.startsWith('-'))
            .map((line: string) => line.substring(1).trim());
          
          if (ruleLines.length >= 2) {
            setCustomRulesText(ruleLines[1]);
          } else if (ruleLines.length === 1) {
            setCustomRulesText(ruleLines[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching appointment image rules:', error);
      }
    };

    fetchCustomRules();
  }, [language]);

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    const dayName = t.appointment.form.days[format(date, 'EEEE').toLowerCase() as keyof typeof t.appointment.form.days];
    const monthName = t.appointment.form.months[format(date, 'MMMM').toLowerCase() as keyof typeof t.appointment.form.months];
    const day = format(date, 'd');
    const year = format(date, 'yyyy');
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const bookingWithDetails = {
        ...booking,
        name: booking.name,
        phone: booking.phone,
        age: booking.age,
        city: booking.city
      };
      
      await downloadAppointmentImage(bookingWithDetails, 'patient', t.appointment);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 my-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        {/* Success Header */}
        <div className="relative bg-gradient-to-br from-[#2B5C4B] to-[#234539] p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <Check className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{t.appointment.confirmation.title}</h2>
              <p className="text-white/80 text-sm mt-0.5">
                {t.appointment.confirmation.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Appointment Details */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 16rem)' }}>
          <div className="p-6 space-y-6">
            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#2B5C4B]/5 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-[#2B5C4B]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.appointment.confirmation.date}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(booking.appointment_date)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#2B5C4B]/5 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-[#2B5C4B]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.appointment.confirmation.time}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.appointment_time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="bg-[#2B5C4B]/5 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                      <User className="h-4 w-4 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.appointment.form.name}</p>
                      <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.appointment.form.phone}</p>
                      <p className="text-sm font-medium text-gray-900">{booking.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                      <User className="h-4 w-4 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.appointment.form.age}</p>
                      <p className="text-sm font-medium text-gray-900">{booking.age}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.appointment.form.city}</p>
                      <p className="text-sm font-medium text-gray-900">{booking.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking ID */}
            <div className="bg-[#2B5C4B]/5 rounded-xl p-4">
              <p className="text-xs text-gray-500">{t.appointment.confirmation.bookingId}</p>
              <p className="text-sm font-medium text-gray-900">#{booking.id.slice(-8).toUpperCase()}</p>
            </div>
            
            {/* Hidden div to prevent linter errors for variables used in image download */}
            <div style={{ display: 'none' }}>
              {customRulesText}
            </div>
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 h-11 px-4 text-sm font-medium text-[#2B5C4B] hover:bg-[#2B5C4B]/5 border border-[#2B5C4B]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#2B5C4B]/30 border-t-[#2B5C4B] rounded-full animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 flex-shrink-0" />
                  <span>Download</span>
                </>
              )}
            </button>
            <button
              onClick={onScheduleAnother}
              className="flex-1 h-11 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors"
            >
              {t.appointment.confirmation.scheduleAnother}
            </button>
            <button
              onClick={onClose}
              className="flex-1 h-11 px-4 text-sm font-medium text-white bg-[#2B5C4B] rounded-xl hover:bg-[#234539] focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 transition-colors"
            >
              {t.common.done}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
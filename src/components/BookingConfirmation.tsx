import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Clock, User, Phone, MapPin, X, Download } from 'lucide-react';
import { BookingDetails } from '../types';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useTranslation } from '../i18n/useTranslation';
import { downloadAppointmentImage } from '../utils/imageDownload';
import { useState } from 'react';

const TIMEZONE = 'Asia/Kolkata';

interface BookingConfirmationProps {
  booking: BookingDetails;
  onClose: () => void;
  onScheduleAnother: () => void;
}

export function BookingConfirmation({ booking, onClose, onScheduleAnother }: BookingConfirmationProps) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

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
      await downloadAppointmentImage(booking, 'patient', t.appointment);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto overflow-hidden will-change-transform"
          onClick={e => e.stopPropagation()}
          style={{ maxHeight: '90vh' }}
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6 relative sticky top-0 z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-white/10 rounded-xl p-2 sm:p-3">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">{t.appointment.confirmation.title}</h2>
                <p className="text-green-100 text-sm mt-0.5">
                  {t.appointment.confirmation.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-full transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Date & Time */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t.appointment.confirmation.date}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(booking.appointment_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Clock className="h-4 w-4 text-green-600" />
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

                {/* Personal Details */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.appointment.form.name}</p>
                      <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.appointment.form.phone}</p>
                      <p className="text-sm font-medium text-gray-900">{booking.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.appointment.form.city}</p>
                      <p className="text-sm font-medium text-gray-900">{booking.city}</p>
                    </div>
                  </div>
                </div>

                {/* Booking ID */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <p className="text-xs text-gray-500">{t.appointment.confirmation.bookingId}</p>
                  <p className="text-sm font-medium text-gray-900">#{booking.id.slice(-8).toUpperCase()}</p>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-sm text-blue-800">
                  <h4 className="font-medium mb-2">{t.appointment.confirmation.notes.title}</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                    <li>{t.appointment.confirmation.notes.arrival}</li>
                    <li>{t.appointment.confirmation.notes.records}</li>
                    <li>{t.appointment.confirmation.notes.mask}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative w-full">
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors flex items-center justify-center gap-2 relative"
                  style={{ transform: 'translate3d(0, 0, 0)' }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {downloading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{ transform: 'translate3d(0, 0, 0)' }}
                        />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
              <button
                onClick={onScheduleAnother}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors"
              >
                {t.appointment.confirmation.scheduleAnother}
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
              >
                {t.common.done}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
import { motion } from 'framer-motion';
import { X, User, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { BookingDetails as BookingDetailsType, Translations } from '../types';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

interface BookingDetailsProps {
  booking: BookingDetailsType;
  onClose: () => void;
  t: Translations;
}

export function BookingDetails({ booking, onClose, t }: BookingDetailsProps) {
  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
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
        className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t.bookingDetails}</h2>
          <button
            onClick={onClose}
            className="hover:bg-blue-500 p-1 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Personal Details */}
          <div className="space-y-3">
            {[
              { icon: User, label: t.name, value: booking.name },
              { icon: Phone, label: t.phone, value: booking.phone },
              { icon: User, label: t.age, value: booking.age },
              { icon: MapPin, label: t.city, value: booking.city },
              { icon: Calendar, label: t.bookingDate, value: formatDate(booking.appointment_date) },
              { icon: Clock, label: t.bookingTime, value: booking.appointment_time }
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <item.icon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
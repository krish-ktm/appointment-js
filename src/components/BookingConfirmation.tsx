import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Clock, User, Phone, MapPin, X } from 'lucide-react';
import { BookingDetails, Translations } from '../types';

interface BookingConfirmationProps {
  booking: BookingDetails;
  onClose: () => void;
  onScheduleAnother: () => void;
  t: Translations;
}

export function BookingConfirmation({ booking, onClose, onScheduleAnother, t }: BookingConfirmationProps) {
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
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 relative">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded-xl p-3">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t.success}</h2>
                <p className="text-green-100 text-sm mt-1">
                  Your appointment has been confirmed
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

          {/* Booking Details */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Date & Time */}
              <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.bookingDate}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(booking.appointment_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.bookingTime}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.appointment_time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.name}</p>
                    <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.phone}</p>
                    <p className="text-sm font-medium text-gray-900">{booking.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.city}</p>
                    <p className="text-sm font-medium text-gray-900">{booking.city}</p>
                  </div>
                </div>
              </div>

              {/* Booking ID */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">{t.bookingId}</p>
                <p className="text-sm font-medium text-gray-900">#{booking.id.slice(-8).toUpperCase()}</p>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>Please arrive 10 minutes before your appointment time</li>
                  <li>Bring any relevant medical records or previous prescriptions</li>
                  <li>Wear a mask during your visit</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onScheduleAnother}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors"
              >
                Schedule Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
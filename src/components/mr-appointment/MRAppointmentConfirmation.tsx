import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Building2, Users, Phone, Briefcase, X, Download } from 'lucide-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useTranslation } from '../../i18n/useTranslation';
import { downloadAppointmentImage } from '../../utils/imageDownload';
import { useState } from 'react';

const TIMEZONE = 'Asia/Kolkata';

interface MRAppointmentDetails {
  id: string;
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: string;
  created_at: string;
}

interface MRAppointmentConfirmationProps {
  appointment: MRAppointmentDetails;
  onClose: () => void;
  onScheduleAnother: () => void;
}

export function MRAppointmentConfirmation({ appointment, onClose, onScheduleAnother }: MRAppointmentConfirmationProps) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    const dayName = t.mrAppointment.form.days[format(date, 'EEEE').toLowerCase() as keyof typeof t.mrAppointment.form.days];
    const monthName = t.mrAppointment.form.months[format(date, 'MMMM').toLowerCase() as keyof typeof t.mrAppointment.form.months];
    const day = format(date, 'd');
    const year = format(date, 'yyyy');
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadAppointmentImage(appointment, 'mr', t.mrAppointment);
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
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 my-8 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6 relative">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-white/10 rounded-xl p-2 sm:p-3">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">{t.mrAppointment.confirmation.title}</h2>
                <p className="text-green-100 text-sm mt-0.5">
                  {t.mrAppointment.confirmation.subtitle}
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

          {/* Appointment Details */}
          <div className="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="space-y-3 sm:space-y-4">
              {/* Date */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.mrAppointment.confirmation.appointmentDate}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(appointment.appointment_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* MR Details */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.mrAppointment.confirmation.mrName}</p>
                    <p className="text-sm font-medium text-gray-900">{appointment.mr_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.mrAppointment.confirmation.companyName}</p>
                    <p className="text-sm font-medium text-gray-900">{appointment.company_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.mrAppointment.confirmation.divisionName}</p>
                    <p className="text-sm font-medium text-gray-900">{appointment.division_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.mrAppointment.confirmation.contactNo}</p>
                    <p className="text-sm font-medium text-gray-900">{appointment.contact_no}</p>
                  </div>
                </div>
              </div>

              {/* Booking ID */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <p className="text-xs text-gray-500">{t.mrAppointment.confirmation.bookingId}</p>
                <p className="text-sm font-medium text-gray-900">#{appointment.id.slice(-8).toUpperCase()}</p>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-sm text-blue-800">
                <h4 className="font-medium mb-2">{t.mrAppointment.confirmation.notes.title}</h4>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                  <li>{t.mrAppointment.confirmation.notes.arrival}</li>
                  <li>{t.mrAppointment.confirmation.notes.id}</li>
                  <li>{t.mrAppointment.confirmation.notes.mask}</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
              <div className="relative w-full">
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {downloading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
                {t.mrAppointment.confirmation.scheduleAnother}
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
              >
                {t.mrAppointment.confirmation.done}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
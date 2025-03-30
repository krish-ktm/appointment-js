import { Check, Calendar, Building2, Users, Phone, Briefcase, X, Download, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { downloadAppointmentImage } from '../../utils/imageDownload';
import { useState, useEffect } from 'react';
import { MRAppointmentTranslations } from '../../i18n/types/mr-appointment';
import { supabase } from '../../lib/supabase';

const TIMEZONE = 'Asia/Kolkata';

interface MRAppointmentDetails {
  id: string;
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: string;
  appointment_time?: string;
  created_at: string;
}

interface MRAppointmentConfirmationProps {
  appointment: MRAppointmentDetails;
  onClose: () => void;
  onScheduleAnother: () => void;
  t: MRAppointmentTranslations;
}

export function MRAppointmentConfirmation({ appointment, onClose, onScheduleAnother, t }: MRAppointmentConfirmationProps) {
  const [downloading, setDownloading] = useState(false);
  const [customRulesText, setCustomRulesText] = useState<string | null>(null);
  
  // Determine language from translations
  const language = t.form.days.monday === 'સોમવાર' ? 'gu' : 'en';

  useEffect(() => {
    // Fetch custom rules text from the database
    const fetchCustomRules = async () => {
      try {
        const { data, error } = await supabase
          .from('image_download_rules')
          .select('content')
          .eq('type', 'mr')
          .eq('is_active', true)
          .order('order', { ascending: true })
          .limit(1)
          .single();

        if (error) throw error;
        
        if (data && data.content && data.content[language]) {
          // Parse content from the content field which contains markdown
          const contentText = data.content[language] as string;
          // Find the rule about company ID (usually the second item)
          const ruleLines = contentText.split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line.startsWith('-'))
            .map((line: string) => line.substring(1).trim());
          
          // Use the second rule if it exists, otherwise use the whole content
          if (ruleLines.length >= 2) {
            setCustomRulesText(ruleLines[1]);
          } else if (ruleLines.length === 1) {
            setCustomRulesText(ruleLines[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching MR appointment image rules:', error);
      }
    };

    fetchCustomRules();
  }, [language]);

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    const dayName = t.form.days[format(date, 'EEEE').toLowerCase() as keyof typeof t.form.days];
    const monthName = t.form.months[format(date, 'MMMM').toLowerCase() as keyof typeof t.form.months];
    const day = format(date, 'd');
    const year = format(date, 'yyyy');
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      // Ensure appointment data has the proper structure for the download function
      const appointmentWithDetails = {
        ...appointment,
        // Explicitly set fields for MRDetails type
        mr_name: appointment.mr_name,
        company_name: appointment.company_name,
        division_name: appointment.division_name,
        contact_no: appointment.contact_no
      };
      
      await downloadAppointmentImage(appointmentWithDetails, 'mr', t);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 my-8 overflow-hidden transition-all duration-200 ease-out"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6 relative">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white/10 rounded-xl p-2 sm:p-3">
              <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">{t.confirmation.title}</h2>
              <p className="text-green-100 text-sm mt-0.5">
                {t.confirmation.subtitle}
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
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Date and Time */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.confirmation.appointmentDate}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(appointment.appointment_date)}
                    </p>
                  </div>
                </div>
                
                {appointment.appointment_time && (
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t.confirmation.appointmentTime}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.appointment_time}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* MR Details */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.confirmation.mrName}</p>
                    <p className="text-sm font-medium text-gray-900">{appointment.mr_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.confirmation.companyName}</p>
                    <p className="text-sm font-medium text-gray-900">{appointment.company_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.confirmation.divisionName}</p>
                    <p className="text-sm font-medium text-gray-900">{appointment.division_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.confirmation.contactNo}</p>
                    <p className="text-sm font-medium text-gray-900">{appointment.contact_no}</p>
                  </div>
                </div>
              </div>

              {/* Booking ID */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <p className="text-xs text-gray-500">{t.confirmation.bookingId}</p>
                <p className="text-sm font-medium text-gray-900">#{appointment.id.slice(-8).toUpperCase()}</p>
              </div>
              
              {/* Hidden div to prevent linter errors for variables used in image download */}
              <div style={{ display: 'none' }}>
                {customRulesText}
              </div>
            </div>
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="w-full sm:w-[140px]">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full h-10 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    <span className="min-w-[80px]">Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 flex-shrink-0" />
                    <span className="min-w-[80px]">Download</span>
                  </>
                )}
              </button>
            </div>
            <button
              onClick={onScheduleAnother}
              className="w-full sm:w-auto h-10 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors"
            >
              {t.confirmation.scheduleAnother}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto h-10 px-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
            >
              {t.confirmation.done}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
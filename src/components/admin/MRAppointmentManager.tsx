import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Building2, Users, Phone, Briefcase, Calendar } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface MRAppointment {
  id: string;
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: string;
  created_at: string;
}

const TIMEZONE = 'Asia/Kolkata';

export function MRAppointmentManager() {
  const [appointments, setAppointments] = useState<MRAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // Get today's and tomorrow's date in IST
      const istNow = utcToZonedTime(new Date(), TIMEZONE);
      const todayStr = format(istNow, 'yyyy-MM-dd');
      const tomorrowStr = format(utcToZonedTime(new Date(istNow.setDate(istNow.getDate() + 1)), TIMEZONE), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('mr_appointments')
        .select('*')
        .in('appointment_date', [todayStr, tomorrowStr])
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading MR appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, app) => {
    const date = utcToZonedTime(new Date(app.appointment_date), TIMEZONE);
    const key = isToday(date) ? 'today' : isTomorrow(date) ? 'tomorrow' : 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(app);
    return acc;
  }, { today: [], tomorrow: [] } as Record<string, MRAppointment[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">MR Appointments</h2>
      </div>

      <div className="space-y-6">
        {['today', 'tomorrow'].map(date => (
          <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {date === 'today' ? "Today's Schedule" : "Tomorrow's Schedule"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {appointmentsByDate[date].length > 0 
                        ? formatDate(appointmentsByDate[date][0].appointment_date)
                        : formatDate(new Date().toISOString())}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Appointments</p>
                    <p className="text-2xl font-semibold text-blue-600">{appointmentsByDate[date].length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {appointmentsByDate[date].map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-200 hover:shadow transition-all duration-200"
                  >
                    <div className="p-5">
                      {/* ID */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-400">#{appointment.id.slice(-4)}</span>
                      </div>

                      {/* MR Info */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="bg-gray-50 p-2 rounded-lg flex-shrink-0">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.mr_name}</h3>
                          <p className="text-sm text-gray-500">
                            {appointment.contact_no}
                          </p>
                        </div>
                      </div>

                      {/* Company Details */}
                      <div className="space-y-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{appointment.company_name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{appointment.division_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {appointmentsByDate[date].length === 0 && (
                  <div className="col-span-full">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Appointments</h3>
                      <p className="text-gray-500">There are no MR appointments scheduled for {date === 'today' ? 'today' : 'tomorrow'}.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
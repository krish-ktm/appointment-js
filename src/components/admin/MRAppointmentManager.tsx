import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Building2, Users, Briefcase, Calendar } from 'lucide-react';
import { format } from 'date-fns';
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
      const { data, error } = await supabase
        .from('mr_appointments')
        .select('*')
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
    const date = app.appointment_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(app);
    return acc;
  }, {} as Record<string, MRAppointment[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">MR Appointments</h2>
      </div>

      <div className="space-y-6">
        {Object.entries(appointmentsByDate).map(([date, dateAppointments]) => (
          <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Schedule
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {formatDate(date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Appointments</p>
                    <p className="text-2xl font-semibold text-blue-600">{dateAppointments.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {dateAppointments.map((appointment) => (
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
              </div>
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Appointments</h3>
            <p className="text-gray-500">There are no MR appointments scheduled.</p>
          </div>
        )}
      </div>
    </div>
  );
}
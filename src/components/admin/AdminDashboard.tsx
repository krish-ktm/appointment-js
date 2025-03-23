import { useState, useEffect } from 'react';
import { getTodayAndTomorrowAppointments } from '../../lib/appointments';
import { User, Appointment } from '../../types';
import { toast } from 'react-hot-toast';
import { AppointmentsTable } from './AppointmentsTable';
import { LoadingSpinner } from '../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { isToday, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Users, Calendar, MessageCircle, Bell, ArrowUpRight, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TIMEZONE = 'Asia/Kolkata';

interface DashboardStats {
  totalAppointments: number;
  totalMessages: number;
  totalNotices: number;
  totalUsers: number;
}

interface MRAppointment {
  id: string;
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: string;
  created_at: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [mrAppointments, setMRAppointments] = useState<MRAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    totalMessages: 0,
    totalNotices: 0,
    totalUsers: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        throw new Error('Authentication required');
      }

      // Get today's date in IST
      const today = utcToZonedTime(new Date(), TIMEZONE);
      const todayStr = format(today, 'yyyy-MM-dd');

      // Load appointments
      const { appointments: appts, error } = await getTodayAndTomorrowAppointments();
      if (error) {
        toast.error(`Error loading appointments: ${error}`);
      } else {
        setAppointments(appts);
      }

      // Load MR appointments
      const { data: mrAppts, error: mrError } = await supabase
        .from('mr_appointments')
        .select('*')
        .eq('appointment_date', todayStr)
        .order('created_at', { ascending: true });

      if (mrError) {
        toast.error(`Error loading MR appointments: ${mrError.message}`);
      } else {
        setMRAppointments(mrAppts || []);
      }

      // Load dashboard stats
      const [
        { count: appointmentsCount },
        { count: messagesCount },
        { count: noticesCount },
        { count: usersCount }
      ] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('doctor_messages').select('*', { count: 'exact', head: true }),
        supabase.from('notices').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalAppointments: appointmentsCount || 0,
        totalMessages: messagesCount || 0,
        totalNotices: noticesCount || 0,
        totalUsers: usersCount || 0
      });

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error(error.message || 'Failed to load data');
      if (error.message === 'Authentication required') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Filter today's appointments
  const todayAppointments = appointments.filter(app => {
    const appointmentDate = utcToZonedTime(new Date(app.appointment_date), TIMEZONE);
    return isToday(appointmentDate);
  });

  const StatCard = ({ icon: Icon, label, value, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        {onClick && <ArrowUpRight className="h-5 w-5 text-gray-400" />}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Calendar} 
          label="Total Appointments" 
          value={stats.totalAppointments}
          onClick={() => navigate('/admin/appointments')}
        />
        <StatCard 
          icon={MessageCircle} 
          label="Doctor Messages" 
          value={stats.totalMessages}
          onClick={() => navigate('/admin/messages')}
        />
        <StatCard 
          icon={Bell} 
          label="Active Notices" 
          value={stats.totalNotices}
          onClick={() => navigate('/admin/notices')}
        />
        <StatCard 
          icon={Users} 
          label="System Users" 
          value={stats.totalUsers}
          onClick={() => navigate('/admin/users')}
        />
      </div>

      {/* Today's Patient Appointments */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-medium text-gray-900">Today's Patient Appointments</h2>
            <button
              onClick={loadData}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No patient appointments scheduled for today
            </div>
          ) : (
            <AppointmentsTable appointments={todayAppointments} />
          )}
        </div>
      </div>

      {/* Today's MR Appointments */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Today's MR Appointments</h2>
          </div>
          {mrAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No MR appointments scheduled for today
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mrAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {appointment.mr_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        #{appointment.id.slice(-4).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Company:</span> {appointment.company_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Division:</span> {appointment.division_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Contact:</span> {appointment.contact_no}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
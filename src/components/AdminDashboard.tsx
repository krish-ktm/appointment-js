import { useState, useEffect } from 'react';
import { getUsers } from '../lib/auth';
import { getTodayAndTomorrowAppointments } from '../lib/appointments';
import { User, Appointment } from '../types';
import { toast } from 'react-hot-toast';
import { AppointmentsTable } from './AppointmentsTable';
import { UsersTable } from './UsersTable';
import { TabNavigation } from './TabNavigation';
import { LoadingSpinner } from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'users'>('appointments');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        throw new Error('Authentication required');
      }

      const currentUser = JSON.parse(userStr) as User;
      
      const [usersResult, appointmentsResult] = await Promise.all([
        currentUser.role === 'superadmin' ? getUsers() : { users: [], error: null },
        getTodayAndTomorrowAppointments()
      ]);

      if (usersResult.error) {
        toast.error(`Error loading users: ${usersResult.error}`);
      } else {
        setUsers(usersResult.users);
      }

      if (appointmentsResult.error) {
        toast.error(`Error loading appointments: ${appointmentsResult.error}`);
      } else {
        setAppointments(appointmentsResult.appointments);
      }

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

  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) as User : null;

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Group appointments by date
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
  
  const appointmentsByDate = {
    [today]: appointments.filter(app => app.appointment_date === today),
    [tomorrow]: appointments.filter(app => app.appointment_date === tomorrow)
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {currentUser.role === 'superadmin' && (
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      
      {(activeTab === 'appointments' || currentUser.role !== 'superadmin') ? (
        <div className="space-y-4 sm:space-y-6">
          {[today, tomorrow].map(date => (
            <div key={date} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {date === today ? "Today's Appointments" : "Tomorrow's Appointments"}
                  </h2>
                  {date === today && (
                    <button
                      onClick={loadData}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Refresh
                    </button>
                  )}
                </div>
                {appointmentsByDate[date].length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No appointments scheduled for {date === today ? 'today' : 'tomorrow'}
                  </div>
                ) : (
                  <AppointmentsTable appointments={appointmentsByDate[date]} />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Users</h2>
            <UsersTable users={users} onUserUpdated={loadData} />
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { getTodayAndTomorrowAppointments } from '../../lib/appointments';
import { User, Appointment } from '../../types';
import { toast } from 'react-hot-toast';
import { AppointmentsTable } from './AppointmentsTable';
import { LoadingSpinner } from '../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { isToday, isTomorrow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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

      const { appointments, error } = await getTodayAndTomorrowAppointments();

      if (error) {
        toast.error(`Error loading appointments: ${error}`);
      } else {
        setAppointments(appointments);
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

  // Group appointments by date using IST timezone
  const appointmentsByDate = appointments.reduce((acc, app) => {
    const appointmentDate = utcToZonedTime(new Date(app.appointment_date), TIMEZONE);
    
    if (isToday(appointmentDate)) {
      if (!acc.today) acc.today = [];
      acc.today.push(app);
    } else if (isTomorrow(appointmentDate)) {
      if (!acc.tomorrow) acc.tomorrow = [];
      acc.tomorrow.push(app);
    }
    
    return acc;
  }, { today: [], tomorrow: [] } as { today: Appointment[], tomorrow: Appointment[] });

  return (
    <div className="space-y-4 sm:space-y-6">
      {['today', 'tomorrow'].map(date => (
        <div key={date} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {date === 'today' ? "Today's Appointments" : "Tomorrow's Appointments"}
              </h2>
              {date === 'today' && (
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
                No appointments scheduled for {date === 'today' ? 'today' : 'tomorrow'}
              </div>
            ) : (
              <AppointmentsTable appointments={appointmentsByDate[date]} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
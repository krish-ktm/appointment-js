import { useState, useEffect } from 'react';
import { getUsers } from '../lib/auth';
import { getTodayAppointments } from '../lib/appointments';
import { User, Appointment } from '../types';
import { toast } from 'react-hot-toast';
import { AppointmentsTable } from './AppointmentsTable';
import { UsersTable } from './UsersTable';
import { TabNavigation } from './TabNavigation';
import { LoadingSpinner } from './LoadingSpinner';

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'users'>('appointments');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [{ users }, { appointments }] = await Promise.all([
        getUsers(),
        getTodayAppointments()
      ]);
      setUsers(users);
      setAppointments(appointments);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'appointments' ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Appointments</h2>
            <AppointmentsTable appointments={appointments} />
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Users</h2>
            <UsersTable users={users} />
          </div>
        </div>
      )}
    </div>
  );
}
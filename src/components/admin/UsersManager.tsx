import { useState, useEffect } from 'react';
import { User } from '../../types';
import { getUsers } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { UsersTable } from './UsersTable';
import { LoadingSpinner } from '../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export function UsersManager() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        throw new Error('Authentication required');
      }

      const currentUser = JSON.parse(userStr) as User;
      if (currentUser.role !== 'superadmin') {
        navigate('/admin');
        throw new Error('Unauthorized access');
      }

      const { users, error } = await getUsers();
      
      if (error) {
        throw new Error(error);
      }

      setUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2 shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <UsersTable users={users} onUserUpdated={loadUsers} />
        </div>
      </div>
    </div>
  );
}
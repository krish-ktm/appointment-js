import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { User } from '../types';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from './LoadingSpinner';

export function AdminLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Please login to access admin panel');
      }

      const user = JSON.parse(userStr) as User;
      if (!['superadmin', 'receptionist'].includes(user.role)) {
        throw new Error('Unauthorized access');
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
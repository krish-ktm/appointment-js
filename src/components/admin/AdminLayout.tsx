import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { User } from '../../types';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../LoadingSpinner';
import { Menu, X, Calendar, Bell, MessageCircle, Building2, LogOut, ChevronDown, Users, Clock, CalendarOff } from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) as User : null;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const navigation = [
    { name: 'Appointments', href: '/admin', icon: Calendar },
    { name: 'MR Appointments', href: '/admin/mr-appointments', icon: Building2 },
    ...(currentUser?.role === 'superadmin' ? [
      { name: 'Notice Board', href: '/admin/notices', icon: Bell },
      { name: 'Doctor Messages', href: '/admin/messages', icon: MessageCircle },
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Time Management', href: '/admin/time-management', icon: Clock },
      { name: 'Closure Dates', href: '/admin/closure-dates', icon: CalendarOff }
    ] : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <div className="flex flex-col flex-grow p-4">
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto">
              <div className="border-t border-gray-200 pt-4">
                <div className="px-3 py-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">
                          {currentUser?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                      <p className="text-xs text-gray-500">{currentUser?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">
                      {currentUser?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-900">
                        <p className="font-medium">{currentUser?.name}</p>
                        <p className="text-gray-500">{currentUser?.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-4 bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="bg-white border-b border-gray-200">
            <nav className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-lg ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
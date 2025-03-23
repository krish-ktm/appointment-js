import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { User } from '../../types';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../LoadingSpinner';
import { 
  Menu, 
  X, 
  Calendar, 
  Bell, 
  MessageCircle, 
  Building2, 
  LogOut, 
  ChevronDown, 
  Users, 
  Settings,
  LayoutDashboard,
  ChevronRight,
  ChevronUp
} from 'lucide-react';

interface NavigationGroup {
  name: string;
  items: {
    name: string;
    href: string;
    icon: any;
  }[];
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['General', 'Appointments', 'MR Management', 'Communication', 'System']);

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

  const navigationGroups: NavigationGroup[] = [
    {
      name: 'General',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard }
      ]
    },
    {
      name: 'Appointments',
      items: [
        { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
        ...(currentUser?.role === 'superadmin' ? [
          { name: 'Appointment Settings', href: '/admin/appointment-settings', icon: Settings }
        ] : [])
      ]
    },
    {
      name: 'MR Management',
      items: [
        { name: 'MR Appointments', href: '/admin/mr-appointments', icon: Building2 },
        ...(currentUser?.role === 'superadmin' ? [
          { name: 'MR Settings', href: '/admin/mr-settings', icon: Settings }
        ] : [])
      ]
    },
    {
      name: 'Communication',
      items: [
        { name: 'Notice Board', href: '/admin/notices', icon: Bell },
        { name: 'Doctor Messages', href: '/admin/messages', icon: MessageCircle }
      ]
    },
    {
      name: 'System',
      items: [
        { name: 'Users', href: '/admin/users', icon: Users }
      ]
    }
  ].filter(group => group.items.length > 0);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div 
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
        }`}
      >
        <div className="flex flex-col flex-grow bg-gradient-to-b from-blue-900 to-blue-800 text-white">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-blue-900/50 backdrop-blur-sm">
            <h1 className={`font-bold transition-all duration-300 ${
              isSidebarCollapsed ? 'text-lg' : 'text-xl'
            }`}>
              {isSidebarCollapsed ? 'AP' : 'Admin Panel'}
            </h1>
            <button
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${
                isSidebarCollapsed ? 'rotate-0' : 'rotate-180'
              }`} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex flex-col flex-grow px-3 py-4">
            <nav className="flex-1 space-y-1">
              {navigationGroups.map((group) => (
                <div key={group.name} className="mb-2">
                  {!isSidebarCollapsed && (
                    <div 
                      className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-gray-300"
                      onClick={() => toggleGroup(group.name)}
                    >
                      <span>{group.name}</span>
                      <ChevronUp className={`h-4 w-4 transition-transform duration-200 ${
                        expandedGroups.includes(group.name) ? 'rotate-0' : 'rotate-180'
                      }`} />
                    </div>
                  )}
                  <div className={`space-y-1 ${
                    !isSidebarCollapsed && !expandedGroups.includes(group.name) ? 'hidden' : ''
                  }`}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${
                            active
                              ? 'bg-blue-500/20 text-white'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {active && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-300/20 animate-pulse" />
                          )}
                          <Icon className={`flex-shrink-0 transition-all duration-300 relative z-10 ${
                            isSidebarCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'
                          }`} />
                          <span className={`transition-all duration-300 relative z-10 ${
                            isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                          }`}>
                            {item.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* User Profile */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className={`transition-all duration-300 ${
                isSidebarCollapsed ? 'text-center' : ''
              }`}>
                <div className="flex items-center group cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-lg">
                      <span className="text-sm font-medium">
                        {currentUser?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className={`ml-3 transition-all duration-300 ${
                    isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                  }`}>
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-gray-400">{currentUser?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`mt-2 flex items-center px-3 py-2 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/20 transition-colors w-full ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <LogOut className={`h-4 w-4 ${isSidebarCollapsed ? '' : 'mr-2'}`} />
                  <span className={`transition-all duration-300 ${
                    isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                  }`}>
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="bg-blue-900 text-white">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {currentUser?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden bg-blue-800 ring-1 ring-white/10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm">
                        <p className="font-medium text-white">{currentUser?.name}</p>
                        <p className="text-blue-300">{currentUser?.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
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
          <div className="bg-blue-900 border-t border-white/10">
            <nav className="px-4 py-3">
              {navigationGroups.map((group) => (
                <div key={group.name} className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                    {group.name}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-3 py-2 text-base font-medium rounded-xl ${
                            active
                              ? 'bg-blue-500/20 text-white'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      }`}>
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
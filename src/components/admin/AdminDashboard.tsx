import { useState, useEffect } from 'react';
import { User } from '../../types';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, Bell, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalMessages: number;
  totalNotices: number;
  totalUsers: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
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

      // Load dashboard stats
      const [
        { count: messagesCount },
        { count: noticesCount },
        { count: usersCount }
      ] = await Promise.all([
        supabase.from('doctor_messages').select('*', { count: 'exact', head: true }),
        supabase.from('notices').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true })
      ]);

      setStats({
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Clock } from 'lucide-react';
import { ClosureDatesManager } from './ClosureDatesManager';

export function ClinicClosurePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login to access this page');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'superadmin') {
      toast.error('Unauthorized access');
      return;
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5C4B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
          <Clock className="h-6 w-6 text-[#2B5C4B]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Clinic Closure Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage clinic closure dates and holidays</p>
        </div>
      </div>

      <ClosureDatesManager />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar } from 'lucide-react';

interface WorkingHour {
  id: string;
  day: string;
  is_working: boolean;
  morning_start: string | null;
  morning_end: string | null;
  evening_start: string | null;
  evening_end: string | null;
}

export function WorkingHours() {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const loadWorkingHours = async () => {
    try {
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .order('day');

      if (error) throw error;
      setWorkingHours(data || []);
    } catch (error) {
      console.error('Error loading working hours:', error);
      toast.error('Failed to load working hours');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkingHoursUpdate = async (day: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('working_hours')
        .update({ [field]: value })
        .eq('day', day);

      if (error) throw error;

      setWorkingHours(workingHours.map(wh => 
        wh.day === day ? { ...wh, [field]: value } : wh
      ));
      toast.success('Working hours updated successfully');
    } catch (error) {
      console.error('Error updating working hours:', error);
      toast.error('Failed to update working hours');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Working Hours</h2>
            <p className="text-sm text-gray-500 mt-1">Configure clinic working hours</p>
          </div>
        </div>

        <div className="space-y-4">
          {workingHours.map((day) => (
            <div key={day.day} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <h3 className="font-medium text-gray-900">{day.day}</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.is_working}
                    onChange={(e) => handleWorkingHoursUpdate(day.day, 'is_working', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700">
                    {day.is_working ? 'Working' : 'Closed'}
                  </span>
                </label>
              </div>

              {day.is_working && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Morning Hours</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={day.morning_start || ''}
                        onChange={(e) => handleWorkingHoursUpdate(day.day, 'morning_start', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={day.morning_end || ''}
                        onChange={(e) => handleWorkingHoursUpdate(day.day, 'morning_end', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Evening Hours</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={day.evening_start || ''}
                        onChange={(e) => handleWorkingHoursUpdate(day.day, 'evening_start', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={day.evening_end || ''}
                        onChange={(e) => handleWorkingHoursUpdate(day.day, 'evening_end', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
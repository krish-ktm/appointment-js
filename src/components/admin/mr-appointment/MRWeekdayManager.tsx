import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar, ChevronDown, Save } from 'lucide-react';

interface MRWeekday {
  id: string;
  day: string;
  is_working: boolean;
  max_appointments: number;
  created_at: string;
  updated_at: string;
}

export function MRWeekdayManager() {
  const [weekdays, setWeekdays] = useState<MRWeekday[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [savingDay, setSavingDay] = useState<string | null>(null);

  useEffect(() => {
    loadWeekdays();
  }, []);

  const loadWeekdays = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mr_weekdays')
        .select('*')
        .order('id');

      if (error) throw error;

      // Define the correct order of days
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      // Sort the weekdays based on the day order
      const sortedWeekdays = [...(data || [])].sort((a, b) => {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      });

      setWeekdays(sortedWeekdays);
    } catch (error) {
      console.error('Error loading weekdays:', error);
      toast.error('Failed to load weekdays');
    } finally {
      setLoading(false);
    }
  };

  const handleWeekdayUpdate = async (day: string) => {
    try {
      setSavingDay(day);
      const dayData = weekdays.find(wd => wd.day === day);
      if (!dayData) return;

      const { error } = await supabase
        .from('mr_weekdays')
        .update(dayData)
        .eq('day', day);

      if (error) throw error;
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating weekday:', error);
      toast.error('Failed to update settings');
    } finally {
      setSavingDay(null);
    }
  };

  const handleToggleWorking = async (day: MRWeekday) => {
    const updatedWeekdays = weekdays.map(wd =>
      wd.id === day.id ? { ...wd, is_working: !wd.is_working } : wd
    );
    setWeekdays(updatedWeekdays);
  };

  const handleMaxAppointmentsChange = (day: MRWeekday, value: number) => {
    const updatedWeekdays = weekdays.map(wd =>
      wd.id === day.id ? { ...wd, max_appointments: value } : wd
    );
    setWeekdays(updatedWeekdays);
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
            <h2 className="text-xl font-semibold text-gray-900">Weekday Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Configure which days MRs can book appointments</p>
          </div>
        </div>

        <div className="space-y-3">
          {weekdays.map((day) => (
            <div key={day.id} className="bg-gray-50 rounded-xl overflow-hidden">
              <div
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <h3 className="font-medium text-gray-900">{day.day}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.is_working}
                      onChange={() => handleToggleWorking(day)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">
                      {day.is_working ? 'Working' : 'Closed'}
                    </span>
                  </label>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      expandedDay === day.day ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              <AnimatePresence>
                {expandedDay === day.day && day.is_working && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Appointments
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={day.max_appointments}
                            onChange={(e) => handleMaxAppointmentsChange(day, parseInt(e.target.value))}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Maximum number of MR appointments allowed for this day
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleWeekdayUpdate(day.day)}
                            disabled={savingDay === day.day}
                            className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                              savingDay === day.day ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                          >
                            {savingDay === day.day ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
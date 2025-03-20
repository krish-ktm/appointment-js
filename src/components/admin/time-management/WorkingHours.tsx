import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar, ChevronDown, Clock, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

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
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

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

  const handleWorkingHoursUpdate = async (day: string, updates: Partial<WorkingHour>) => {
    try {
      const { error } = await supabase
        .from('working_hours')
        .update(updates)
        .eq('day', day);

      if (error) throw error;

      setWorkingHours(workingHours.map(wh => 
        wh.day === day ? { ...wh, ...updates } : wh
      ));
      toast.success('Working hours updated successfully');
    } catch (error) {
      console.error('Error updating working hours:', error);
      toast.error('Failed to update working hours');
    }
  };

  const toggleMorningHours = (day: WorkingHour) => {
    const updates: Partial<WorkingHour> = {};
    
    if (day.morning_start && day.morning_end) {
      updates.morning_start = null;
      updates.morning_end = null;
    } else {
      updates.morning_start = '09:30';
      updates.morning_end = '12:00';
    }

    handleWorkingHoursUpdate(day.day, updates);
  };

  const toggleEveningHours = (day: WorkingHour) => {
    const updates: Partial<WorkingHour> = {};
    
    if (day.evening_start && day.evening_end) {
      updates.evening_start = null;
      updates.evening_end = null;
    } else {
      updates.evening_start = '16:00';
      updates.evening_end = '18:30';
    }

    handleWorkingHoursUpdate(day.day, updates);
  };

  const convertTo12Hour = (time24: string | null): string => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm aa');
  };

  const convertTo24Hour = (time12: string): string => {
    const [time, period] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    let hoursNum = parseInt(hours);
    
    if (period.toLowerCase() === 'pm' && hoursNum !== 12) {
      hoursNum += 12;
    } else if (period.toLowerCase() === 'am' && hoursNum === 12) {
      hoursNum = 0;
    }
    
    return `${hoursNum.toString().padStart(2, '0')}:${minutes}`;
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

        <div className="space-y-3">
          {workingHours.map((day) => (
            <div key={day.day} className="bg-gray-50 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <h3 className="font-medium text-gray-900">{day.day}</h3>
                    {day.is_working && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          {day.morning_start && day.morning_end
                            ? `${convertTo12Hour(day.morning_start)} - ${convertTo12Hour(day.morning_end)}`
                            : 'No morning hours'
                          }
                          {day.evening_start && day.evening_end
                            ? ` | ${convertTo12Hour(day.evening_start)} - ${convertTo12Hour(day.evening_end)}`
                            : ' | No evening hours'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.is_working}
                      onChange={(e) => handleWorkingHoursUpdate(day.day, { is_working: e.target.checked })}
                      className="sr-only peer"
                      onClick={(e) => e.stopPropagation()}
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
              </button>

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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Morning Hours Section */}
                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Sun className="h-5 w-5 text-amber-500" />
                              <h4 className="font-medium text-gray-900">Morning Hours</h4>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!(day.morning_start && day.morning_end)}
                                onChange={() => toggleMorningHours(day)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          {day.morning_start && day.morning_end && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={day.morning_start}
                                onChange={(e) => handleWorkingHoursUpdate(day.day, { morning_start: e.target.value })}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={day.morning_end}
                                onChange={(e) => handleWorkingHoursUpdate(day.day, { morning_end: e.target.value })}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                              />
                            </div>
                          )}
                        </div>

                        {/* Evening Hours Section */}
                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Moon className="h-5 w-5 text-indigo-500" />
                              <h4 className="font-medium text-gray-900">Evening Hours</h4>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!(day.evening_start && day.evening_end)}
                                onChange={() => toggleEveningHours(day)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          {day.evening_start && day.evening_end && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={day.evening_start}
                                onChange={(e) => handleWorkingHoursUpdate(day.day, { evening_start: e.target.value })}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={day.evening_end}
                                onChange={(e) => handleWorkingHoursUpdate(day.day, { evening_end: e.target.value })}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                              />
                            </div>
                          )}
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
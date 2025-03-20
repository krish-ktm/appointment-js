import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar, ChevronDown, Clock, Sun, Moon, Plus, Minus, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parse } from 'date-fns';

interface TimeSlot {
  time: string;
  maxBookings: number;
}

interface WorkingHour {
  id: string;
  day: string;
  is_working: boolean;
  morning_start: string | null;
  morning_end: string | null;
  evening_start: string | null;
  evening_end: string | null;
  slot_interval: number;
  slots: TimeSlot[];
}

export function WorkingHours() {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<{ day: string; index: number } | null>(null);

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

  const generateTimeSlots = (startTime: string, endTime: string, interval: number): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    let currentTime = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());

    while (currentTime <= end) {
      slots.push({
        time: format(currentTime, 'HH:mm'),
        maxBookings: 3
      });
      currentTime = new Date(currentTime.getTime() + interval * 60000);
    }

    return slots;
  };

  const handleGenerateSlots = async (day: WorkingHour) => {
    try {
      let newSlots: TimeSlot[] = [];

      // Generate morning slots
      if (day.morning_start && day.morning_end) {
        newSlots = [
          ...newSlots,
          ...generateTimeSlots(day.morning_start, day.morning_end, day.slot_interval)
        ];
      }

      // Generate evening slots
      if (day.evening_start && day.evening_end) {
        newSlots = [
          ...newSlots,
          ...generateTimeSlots(day.evening_start, day.evening_end, day.slot_interval)
        ];
      }

      await handleWorkingHoursUpdate(day.day, { slots: newSlots });
    } catch (error) {
      console.error('Error generating time slots:', error);
      toast.error('Failed to generate time slots');
    }
  };

  const handleSlotIntervalChange = async (day: string, interval: number) => {
    try {
      await handleWorkingHoursUpdate(day, { slot_interval: interval });
    } catch (error) {
      console.error('Error updating slot interval:', error);
      toast.error('Failed to update slot interval');
    }
  };

  const handleMaxBookingsChange = async (day: WorkingHour, slotIndex: number, maxBookings: number) => {
    try {
      const updatedSlots = [...day.slots];
      updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], maxBookings };
      await handleWorkingHoursUpdate(day.day, { slots: updatedSlots });
    } catch (error) {
      console.error('Error updating max bookings:', error);
      toast.error('Failed to update max bookings');
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
            <p className="text-sm text-gray-500 mt-1">Configure clinic working hours and time slots</p>
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
                            ? `${day.morning_start} - ${day.morning_end}`
                            : 'No morning hours'
                          }
                          {day.evening_start && day.evening_end
                            ? ` | ${day.evening_start} - ${day.evening_end}`
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
                                onChange={() => {
                                  if (day.morning_start && day.morning_end) {
                                    handleWorkingHoursUpdate(day.day, {
                                      morning_start: null,
                                      morning_end: null
                                    });
                                  } else {
                                    handleWorkingHoursUpdate(day.day, {
                                      morning_start: '09:30',
                                      morning_end: '12:00'
                                    });
                                  }
                                }}
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
                                onChange={() => {
                                  if (day.evening_start && day.evening_end) {
                                    handleWorkingHoursUpdate(day.day, {
                                      evening_start: null,
                                      evening_end: null
                                    });
                                  } else {
                                    handleWorkingHoursUpdate(day.day, {
                                      evening_start: '16:00',
                                      evening_end: '18:30'
                                    });
                                  }
                                }}
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

                      {/* Time Slots Section */}
                      <div className="mt-6 bg-white rounded-lg p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-gray-500" />
                            <h4 className="font-medium text-gray-900">Time Slots Settings</h4>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">Interval:</label>
                              <select
                                value={day.slot_interval}
                                onChange={(e) => handleSlotIntervalChange(day.day, parseInt(e.target.value))}
                                className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                              </select>
                            </div>
                            <button
                              onClick={() => handleGenerateSlots(day)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                              Generate Slots
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {day.slots.map((slot, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">{slot.time}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleMaxBookingsChange(day, index, Math.max(1, slot.maxBookings - 1))}
                                    className="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <Minus className="h-3 w-3 text-gray-500" />
                                  </button>
                                  <span className="text-sm text-gray-600 min-w-[20px] text-center">
                                    {slot.maxBookings}
                                  </span>
                                  <button
                                    onClick={() => handleMaxBookingsChange(day, index, slot.maxBookings + 1)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <Plus className="h-3 w-3 text-gray-500" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">Max Bookings</p>
                            </div>
                          ))}
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
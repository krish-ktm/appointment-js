import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar, ChevronDown, Clock, Sun, Moon, Plus, Minus, Settings, Save } from 'lucide-react';
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

interface FormErrors {
  morning?: string;
  evening?: string;
  slots?: string;
}

export function WorkingHours() {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<{ day: string; index: number } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, FormErrors>>({});
  const [savingDay, setSavingDay] = useState<string | null>(null);

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const loadWorkingHours = async () => {
    try {
      setLoading(true);
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

  const validateWorkingHours = (day: WorkingHour): FormErrors => {
    const errors: FormErrors = {};

    if (day.is_working) {
      // Morning validation
      if (day.morning_start && day.morning_end) {
        const morningStart = parse(day.morning_start, 'HH:mm', new Date());
        const morningEnd = parse(day.morning_end, 'HH:mm', new Date());
        if (morningEnd <= morningStart) {
          errors.morning = 'Morning end time must be after start time';
        }
      }

      // Evening validation (except Saturday)
      if (day.day !== 'Saturday' && day.evening_start && day.evening_end) {
        const eveningStart = parse(day.evening_start, 'HH:mm', new Date());
        const eveningEnd = parse(day.evening_end, 'HH:mm', new Date());
        if (eveningEnd <= eveningStart) {
          errors.evening = 'Evening end time must be after start time';
        }
      }

      // Slots validation
      if (day.slots.length === 0) {
        errors.slots = 'At least one time slot is required';
      }
    }

    return errors;
  };

  const handleWorkingHoursUpdate = async (day: string) => {
    try {
      setSavingDay(day);
      const dayData = workingHours.find(wh => wh.day === day);
      if (!dayData) return;

      // Validate before saving
      const errors = validateWorkingHours(dayData);
      if (Object.keys(errors).length > 0) {
        setFormErrors({ ...formErrors, [day]: errors });
        toast.error('Please fix the validation errors before saving');
        return;
      }

      const { error } = await supabase
        .from('working_hours')
        .update(dayData)
        .eq('day', day);

      if (error) throw error;
      toast.success('Working hours updated successfully');
      setFormErrors({ ...formErrors, [day]: {} });
    } catch (error) {
      console.error('Error updating working hours:', error);
      toast.error('Failed to update working hours');
    } finally {
      setSavingDay(null);
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

  const handleGenerateSlots = (day: WorkingHour) => {
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

      setWorkingHours(workingHours.map(wh => 
        wh.day === day.day ? { ...wh, slots: newSlots } : wh
      ));
    } catch (error) {
      console.error('Error generating time slots:', error);
      toast.error('Failed to generate time slots');
    }
  };

  const handleSlotIntervalChange = (day: string, interval: number) => {
    setWorkingHours(workingHours.map(wh => 
      wh.day === day ? { ...wh, slot_interval: interval } : wh
    ));
  };

  const handleMaxBookingsChange = (day: WorkingHour, slotIndex: number, maxBookings: number) => {
    const updatedSlots = [...day.slots];
    updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], maxBookings };
    
    setWorkingHours(workingHours.map(wh => 
      wh.day === day.day ? { ...wh, slots: updatedSlots } : wh
    ));
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
                      onChange={(e) => {
                        setWorkingHours(workingHours.map(wh => 
                          wh.day === day.day ? { ...wh, is_working: e.target.checked } : wh
                        ));
                      }}
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
                                    setWorkingHours(workingHours.map(wh => 
                                      wh.day === day.day ? { ...wh, morning_start: null, morning_end: null } : wh
                                    ));
                                  } else {
                                    setWorkingHours(workingHours.map(wh => 
                                      wh.day === day.day ? { ...wh, morning_start: '09:30', morning_end: '12:00' } : wh
                                    ));
                                  }
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          {day.morning_start && day.morning_end && (
                            <>
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={day.morning_start}
                                  onChange={(e) => {
                                    setWorkingHours(workingHours.map(wh => 
                                      wh.day === day.day ? { ...wh, morning_start: e.target.value } : wh
                                    ));
                                  }}
                                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                  type="time"
                                  value={day.morning_end}
                                  onChange={(e) => {
                                    setWorkingHours(workingHours.map(wh => 
                                      wh.day === day.day ? { ...wh, morning_end: e.target.value } : wh
                                    ));
                                  }}
                                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                />
                              </div>
                              {formErrors[day.day]?.morning && (
                                <p className="mt-2 text-sm text-red-600">{formErrors[day.day].morning}</p>
                              )}
                            </>
                          )}
                        </div>

                        {/* Evening Hours Section */}
                        {day.day !== 'Saturday' && (
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
                                      setWorkingHours(workingHours.map(wh => 
                                        wh.day === day.day ? { ...wh, evening_start: null, evening_end: null } : wh
                                      ));
                                    } else {
                                      setWorkingHours(workingHours.map(wh => 
                                        wh.day === day.day ? { ...wh, evening_start: '16:00', evening_end: '18:30' } : wh
                                      ));
                                    }
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                            {day.evening_start && day.evening_end && (
                              <>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="time"
                                    value={day.evening_start}
                                    onChange={(e) => {
                                      setWorkingHours(workingHours.map(wh => 
                                        wh.day === day.day ? { ...wh, evening_start: e.target.value } : wh
                                      ));
                                    }}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                  />
                                  <span className="text-gray-500">to</span>
                                  <input
                                    type="time"
                                    value={day.evening_end}
                                    onChange={(e) => {
                                      setWorkingHours(workingHours.map(wh => 
                                        wh.day === day.day ? { ...wh, evening_end: e.target.value } : wh
                                      ));
                                    }}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                  />
                                </div>
                                {formErrors[day.day]?.evening && (
                                  <p className="mt-2 text-sm text-red-600">{formErrors[day.day].evening}</p>
                                )}
                              </>
                            )}
                          </div>
                        )}
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
                        {formErrors[day.day]?.slots && (
                          <p className="mt-2 text-sm text-red-600">{formErrors[day.day].slots}</p>
                        )}
                      </div>

                      {/* Save Button */}
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => handleWorkingHoursUpdate(day.day)}
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
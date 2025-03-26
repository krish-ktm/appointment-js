import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar, ChevronDown, Plus, Minus, Trash2, Settings } from 'lucide-react';

interface MRWeekday {
  id: string;
  day: string;
  is_working: boolean;
  max_appointments: number;
  slot_interval: number;
  slots: Array<{
    time: string;
    maxBookings: number;
  }>;
  created_at: string;
  updated_at: string;
}

export function MRWeekdayManager() {
  const [weekdays, setWeekdays] = useState<MRWeekday[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadWeekdays();
  }, []);

  const loadWeekdays = async () => {
    try {
      const { data, error } = await supabase
        .from('mr_weekdays')
        .select('*')
        .order('id');

      if (error) throw error;

      // Sort weekdays in correct order
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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

  const handleToggleWorking = async (e: React.ChangeEvent<HTMLInputElement>, day: MRWeekday) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('mr_weekdays')
        .update({ is_working: !day.is_working })
        .eq('id', day.id);

      if (error) throw error;

      setWeekdays(weekdays.map(wd =>
        wd.id === day.id ? { ...wd, is_working: !day.is_working } : wd
      ));

      toast.success(`${day.day} ${!day.is_working ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling working day:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleSlotIntervalChange = async (day: MRWeekday, interval: number) => {
    try {
      const { error } = await supabase
        .from('mr_weekdays')
        .update({ slot_interval: interval })
        .eq('id', day.id);

      if (error) throw error;

      setWeekdays(weekdays.map(wd =>
        wd.id === day.id ? { ...wd, slot_interval: interval } : wd
      ));

      toast.success('Time slot interval updated successfully');
    } catch (error) {
      console.error('Error updating slot interval:', error);
      toast.error('Failed to update slot interval');
    }
  };

  const generateTimeSlots = (interval: number, maxBookings: number) => {
    const slots = [];
    const times = [
      { start: '09:30 AM', end: '12:00 PM' },
      { start: '02:00 PM', end: '04:00 PM' }
    ];

    for (const period of times) {
      let currentTime = new Date(`2000/01/01 ${period.start}`);
      const endTime = new Date(`2000/01/01 ${period.end}`);

      while (currentTime <= endTime) {
        slots.push({
          time: currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          maxBookings
        });
        currentTime.setMinutes(currentTime.getMinutes() + interval);
      }
    }

    return slots;
  };

  const handleGenerateSlots = async (day: MRWeekday) => {
    try {
      const slots = generateTimeSlots(day.slot_interval, day.max_appointments);

      const { error } = await supabase
        .from('mr_weekdays')
        .update({ slots })
        .eq('id', day.id);

      if (error) throw error;

      setWeekdays(weekdays.map(wd =>
        wd.id === day.id ? { ...wd, slots } : wd
      ));

      toast.success('Time slots generated successfully');
    } catch (error) {
      console.error('Error generating time slots:', error);
      toast.error('Failed to generate time slots');
    }
  };

  const handleDeleteSlot = async (day: MRWeekday, index: number) => {
    try {
      const newSlots = [...day.slots];
      newSlots.splice(index, 1);

      const { error } = await supabase
        .from('mr_weekdays')
        .update({ slots: newSlots })
        .eq('id', day.id);

      if (error) throw error;

      setWeekdays(weekdays.map(wd =>
        wd.id === day.id ? { ...wd, slots: newSlots } : wd
      ));

      toast.success('Time slot deleted successfully');
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast.error('Failed to delete time slot');
    }
  };

  const handleMaxBookingsChange = async (day: MRWeekday, index: number, maxBookings: number) => {
    try {
      const newSlots = [...day.slots];
      newSlots[index] = { ...newSlots[index], maxBookings };

      const { error } = await supabase
        .from('mr_weekdays')
        .update({ slots: newSlots })
        .eq('id', day.id);

      if (error) throw error;

      setWeekdays(weekdays.map(wd =>
        wd.id === day.id ? { ...wd, slots: newSlots } : wd
      ));
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
            <h2 className="text-xl font-semibold text-gray-900">MR Working Days</h2>
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
                  <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={day.is_working}
                      onChange={(e) => handleToggleWorking(e, day)}
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
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
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
                                onChange={(e) => handleSlotIntervalChange(day, parseInt(e.target.value))}
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
                              className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative group"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">{slot.time}</span>
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleDeleteSlot(day, index)}
                                    className="p-1 mr-1 rounded-lg text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-1">
                                    <button
                                      onClick={() => handleMaxBookingsChange(day, index, Math.max(1, slot.maxBookings - 1))}
                                      className="p-1 hover:bg-gray-100 rounded"
                                    >
                                      <Minus className="h-3 w-3 text-gray-500" />
                                    </button>
                                    <span className="text-sm text-gray-600 min-w-[20px] text-center">
                                      {slot.maxBookings}
                                    </span>
                                    <button
                                      onClick={() => handleMaxBookingsChange(day, index, slot.maxBookings + 1)}
                                      className="p-1 hover:bg-gray-100 rounded"
                                    >
                                      <Plus className="h-3 w-3 text-gray-500" />
                                    </button>
                                  </div>
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
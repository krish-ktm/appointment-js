import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Clock, Calendar, Plus, X, Edit2, Trash2, Check } from 'lucide-react';

interface WorkingHours {
  id: string;
  day: string;
  is_working: boolean;
  morning_start: string | null;
  morning_end: string | null;
  evening_start: string | null;
  evening_end: string | null;
}

interface TimeSlot {
  id: string;
  time: string;
  max_bookings: number;
  is_available: boolean;
}

export function TimeManagement() {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [form, setForm] = useState({
    time: '',
    max_bookings: 3,
    is_available: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load working hours
      const { data: workingHoursData, error: workingHoursError } = await supabase
        .from('working_hours')
        .select('*')
        .order('day', { ascending: true });

      if (workingHoursError) throw workingHoursError;
      setWorkingHours(workingHoursData || []);

      // Load time slots
      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('time_slots')
        .select('*')
        .order('time', { ascending: true });

      if (timeSlotsError) throw timeSlotsError;
      setTimeSlots(timeSlotsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load time management data');
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

  const handleTimeSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTimeSlot) {
        const { error } = await supabase
          .from('time_slots')
          .update(form)
          .eq('id', editingTimeSlot.id);

        if (error) throw error;
        toast.success('Time slot updated successfully');
      } else {
        const { error } = await supabase
          .from('time_slots')
          .insert([form]);

        if (error) throw error;
        toast.success('Time slot added successfully');
      }

      setShowTimeSlotForm(false);
      setEditingTimeSlot(null);
      setForm({ time: '', max_bookings: 3, is_available: true });
      loadData();
    } catch (error) {
      console.error('Error saving time slot:', error);
      toast.error('Failed to save time slot');
    }
  };

  const handleTimeSlotDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Time slot deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast.error('Failed to delete time slot');
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Working Hours Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
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
                          value={formatTime(day.morning_start)}
                          onChange={(e) => handleWorkingHoursUpdate(day.day, 'morning_start', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={formatTime(day.morning_end)}
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
                          value={formatTime(day.evening_start)}
                          onChange={(e) => handleWorkingHoursUpdate(day.day, 'evening_start', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={formatTime(day.evening_end)}
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

      {/* Time Slots Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Time Slots</h2>
                <p className="text-sm text-gray-500 mt-1">Manage appointment time slots</p>
              </div>
            </div>
            <button
              onClick={() => setShowTimeSlotForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Time Slot
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{slot.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingTimeSlot(slot);
                        setForm({
                          time: slot.time,
                          max_bookings: slot.max_bookings,
                          is_available: slot.is_available
                        });
                        setShowTimeSlotForm(true);
                      }}
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleTimeSlotDelete(slot.id)}
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Max: {slot.max_bookings} bookings</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slot.is_available}
                      onChange={async () => {
                        try {
                          const { error } = await supabase
                            .from('time_slots')
                            .update({ is_available: !slot.is_available })
                            .eq('id', slot.id);

                          if (error) throw error;
                          loadData();
                        } catch (error) {
                          toast.error('Failed to update time slot');
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Time Slot Modal */}
      {showTimeSlotForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingTimeSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
                </h3>
                <button
                  onClick={() => {
                    setShowTimeSlotForm(false);
                    setEditingTimeSlot(null);
                    setForm({ time: '', max_bookings: 3, is_available: true });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleTimeSlotSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Bookings
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.max_bookings}
                    onChange={(e) => setForm({ ...form, max_bookings: parseInt(e.target.value) })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={form.is_available}
                    onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_available" className="ml-2 text-sm text-gray-700">
                    Available for booking
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTimeSlotForm(false);
                      setEditingTimeSlot(null);
                      setForm({ time: '', max_bookings: 3, is_available: true });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {editingTimeSlot ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
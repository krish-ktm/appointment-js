import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Clock, Calendar, Plus, X, Edit2, Trash2 } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  max_bookings: number;
  is_available: boolean;
}

interface WorkingHours {
  id: string;
  day: string;
  is_working: boolean;
  morning_start?: string;
  morning_end?: string;
  evening_start?: string;
  evening_end?: string;
}

export function TimeManagement() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [form, setForm] = useState({
    time: '',
    max_bookings: 3,
    is_available: true
  });

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .insert([form])
        .select()
        .single();

      if (error) throw error;

      setTimeSlots([...timeSlots, data]);
      setShowTimeSlotForm(false);
      setForm({ time: '', max_bookings: 3, is_available: true });
      toast.success('Time slot added successfully');
    } catch (error) {
      toast.error('Failed to add time slot');
    }
  };

  const handleWorkingHoursUpdate = async (day: string, field: string, value: any) => {
    try {
      const { data, error } = await supabase
        .from('working_hours')
        .update({ [field]: value })
        .eq('day', day)
        .select();

      if (error) throw error;

      setWorkingHours(workingHours.map(wh => 
        wh.day === day ? { ...wh, [field]: value } : wh
      ));
      toast.success('Working hours updated');
    } catch (error) {
      toast.error('Failed to update working hours');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Time Management</h2>
        <button
          onClick={() => setShowTimeSlotForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Time Slot
        </button>
      </div>

      {/* Working Hours Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Working Hours</h3>
          <div className="space-y-4">
            {days.map((day) => (
              <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-32">
                  <span className="font-medium text-gray-700">{day}</span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Morning Hours</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        onChange={(e) => handleWorkingHoursUpdate(day, 'morning_start', e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        onChange={(e) => handleWorkingHoursUpdate(day, 'morning_end', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Evening Hours</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        onChange={(e) => handleWorkingHoursUpdate(day, 'evening_start', e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        onChange={(e) => handleWorkingHoursUpdate(day, 'evening_end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      onChange={(e) => handleWorkingHoursUpdate(day, 'is_working', e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">Working Day</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Time Slots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{slot.time}</p>
                    <p className="text-sm text-gray-500">Max: {slot.max_bookings} bookings</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingTimeSlot(slot);
                      setShowTimeSlotForm(true);
                    }}
                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this time slot?')) {
                        try {
                          const { error } = await supabase
                            .from('time_slots')
                            .delete()
                            .eq('id', slot.id);

                          if (error) throw error;

                          setTimeSlots(timeSlots.filter(s => s.id !== slot.id));
                          toast.success('Time slot deleted successfully');
                        } catch (error) {
                          toast.error('Failed to delete time slot');
                        }
                      }
                    }}
                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
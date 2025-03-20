import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Clock, Plus, Edit2, Trash2, X } from 'lucide-react';
import { TimeSlotModal } from './TimeSlotModal';

interface TimeSlot {
  id: string;
  time: string;
  max_bookings: number;
  is_available: boolean;
}

export function TimeSlots() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .order('time');

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast.error('Failed to load time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Time slot deleted successfully');
      loadTimeSlots();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast.error('Failed to delete time slot');
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
    <>
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
              onClick={() => {
                setEditingSlot(null);
                setShowModal(true);
              }}
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
                        setEditingSlot(slot);
                        setShowModal(true);
                      }}
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(slot.id)}
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
                          loadTimeSlots();
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

      {showModal && (
        <TimeSlotModal
          slot={editingSlot}
          onClose={() => {
            setShowModal(false);
            setEditingSlot(null);
          }}
          onSave={loadTimeSlots}
        />
      )}
    </>
  );
}
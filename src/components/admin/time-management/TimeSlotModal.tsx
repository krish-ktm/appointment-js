import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { X, Clock } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  max_bookings: number;
  is_available: boolean;
}

interface TimeSlotModalProps {
  slot: TimeSlot | null;
  onClose: () => void;
  onSave: () => void;
}

export function TimeSlotModal({ slot, onClose, onSave }: TimeSlotModalProps) {
  const [form, setForm] = useState({
    time: slot?.time || '',
    max_bookings: slot?.max_bookings || 3,
    is_available: slot?.is_available ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (slot) {
        const { error } = await supabase
          .from('time_slots')
          .update(form)
          .eq('id', slot.id);

        if (error) throw error;
        toast.success('Time slot updated successfully');
      } else {
        const { error } = await supabase
          .from('time_slots')
          .insert([form]);

        if (error) throw error;
        toast.success('Time slot added successfully');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving time slot:', error);
      toast.error('Failed to save time slot');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {slot ? 'Edit Time Slot' : 'Add New Time Slot'}
              </h3>
            </div>
            <button
              onClick={onClose}
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
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {slot ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
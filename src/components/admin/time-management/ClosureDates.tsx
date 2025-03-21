import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar, Plus, X, Edit2, Trash2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format, isAfter, isBefore, startOfToday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface ClosureDate {
  id: string;
  date: string;
  reason: string;
  created_at: string;
}

const TIMEZONE = 'Asia/Kolkata';

export function ClosureDates() {
  const [closureDates, setClosureDates] = useState<ClosureDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDate, setEditingDate] = useState<ClosureDate | null>(null);
  const [form, setForm] = useState({
    date: null as Date | null,
    reason: ''
  });

  useEffect(() => {
    loadClosureDates();
  }, []);

  const loadClosureDates = async () => {
    try {
      const { data, error } = await supabase
        .from('clinic_closure_dates')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setClosureDates(data || []);
    } catch (error) {
      console.error('Error loading closure dates:', error);
      toast.error('Failed to load closure dates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!form.date) {
        throw new Error('Please select a date');
      }

      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      
      const user = JSON.parse(userStr);
      const dateStr = format(form.date, 'yyyy-MM-dd');

      if (editingDate) {
        const { error } = await supabase
          .from('clinic_closure_dates')
          .update({
            date: dateStr,
            reason: form.reason,
            created_by: user.id
          })
          .eq('id', editingDate.id);

        if (error) throw error;
        toast.success('Closure date updated successfully');
      } else {
        const { error } = await supabase
          .from('clinic_closure_dates')
          .insert({
            date: dateStr,
            reason: form.reason,
            created_by: user.id
          });

        if (error) throw error;
        toast.success('Closure date added successfully');
      }

      setForm({ date: null, reason: '' });
      setShowForm(false);
      setEditingDate(null);
      loadClosureDates();
    } catch (error) {
      console.error('Error saving closure date:', error);
      toast.error(error.message || 'Failed to save closure date');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this closure date?')) return;

    try {
      const { error } = await supabase
        .from('clinic_closure_dates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Closure date deleted successfully');
      loadClosureDates();
    } catch (error) {
      console.error('Error deleting closure date:', error);
      toast.error('Failed to delete closure date');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Clinic Closure Dates</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Date
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  {editingDate ? 'Edit Closure Date' : 'Add New Closure Date'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingDate(null);
                    setForm({ date: null, reason: '' });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <DatePicker
                    selected={form.date}
                    onChange={(date) => setForm({ ...form, date })}
                    dateFormat="MMMM d, yyyy"
                    minDate={startOfToday()}
                    placeholderText="Select date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Enter reason for closure"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingDate(null);
                      setForm({ date: null, reason: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {editingDate ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {closureDates.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No closure dates have been added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {closureDates.map((date) => {
                const closureDate = utcToZonedTime(new Date(date.date), TIMEZONE);
                const isPast = isBefore(closureDate, startOfToday());
                const isFuture = isAfter(closureDate, startOfToday());

                return (
                  <div
                    key={date.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isPast
                        ? 'bg-gray-50 border-gray-200'
                        : isFuture
                        ? 'bg-blue-50 border-blue-100'
                        : 'bg-green-50 border-green-100'
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${
                        isPast
                          ? 'text-gray-700'
                          : isFuture
                          ? 'text-blue-700'
                          : 'text-green-700'
                      }`}>
                        {formatDate(date.date)}
                      </p>
                      <p className={`text-sm ${
                        isPast
                          ? 'text-gray-500'
                          : isFuture
                          ? 'text-blue-600'
                          : 'text-green-600'
                      }`}>
                        {date.reason}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingDate(date);
                          setForm({
                            date: utcToZonedTime(new Date(date.date), TIMEZONE),
                            reason: date.reason
                          });
                          setShowForm(true);
                        }}
                        className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(date.id)}
                        className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Notice, User } from '../types';
import { toast } from 'react-hot-toast';
import { Plus, Image as ImageIcon, Edit2, Trash2, MoveUp, MoveDown } from 'lucide-react';

export function NoticeManager() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    image_url: '',
    active: true
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error loading notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      
      const user = JSON.parse(userStr) as User;
      const noticeData = {
        ...form,
        created_by: user.id,
        order: notices.length
      };

      if (editingNotice) {
        const { error } = await supabase
          .from('notices')
          .update(noticeData)
          .eq('id', editingNotice.id);

        if (error) throw error;
        toast.success('Notice updated successfully');
      } else {
        const { error } = await supabase
          .from('notices')
          .insert(noticeData);

        if (error) throw error;
        toast.success('Notice created successfully');
      }

      setForm({ title: '', content: '', image_url: '', active: true });
      setShowForm(false);
      setEditingNotice(null);
      loadNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error('Failed to save notice');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Notice deleted successfully');
      loadNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = notices.findIndex(n => n.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === notices.length - 1)
    ) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newNotices = [...notices];
    const temp = newNotices[currentIndex];
    newNotices[currentIndex] = newNotices[newIndex];
    newNotices[newIndex] = temp;

    try {
      const updates = newNotices.map((notice, index) => ({
        id: notice.id,
        order: index
      }));

      const { error } = await supabase
        .from('notices')
        .upsert(updates);

      if (error) throw error;
      setNotices(newNotices);
    } catch (error) {
      console.error('Error reordering notices:', error);
      toast.error('Failed to reorder notices');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Notice Board Manager</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Notice
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
            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingNotice ? 'Edit Notice' : 'Add New Notice'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingNotice(null);
                      setForm({ title: '', content: '', image_url: '', active: true });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {editingNotice ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {notices.map((notice, index) => (
            <li key={notice.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {notice.image_url && (
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={notice.image_url}
                        alt={notice.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {notice.title}
                    </h3>
                    {notice.content && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {notice.content}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMove(notice.id, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded-lg hover:bg-gray-100 ${
                      index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <MoveUp className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleMove(notice.id, 'down')}
                    disabled={index === notices.length - 1}
                    className={`p-1 rounded-lg hover:bg-gray-100 ${
                      index === notices.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <MoveDown className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingNotice(notice);
                      setForm({
                        title: notice.title,
                        content: notice.content || '',
                        image_url: notice.image_url || '',
                        active: notice.active
                      });
                      setShowForm(true);
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <Edit2 className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </li>
          ))}

          {notices.length === 0 && (
            <li className="p-8 text-center text-gray-500">
              No notices have been created yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Notice } from '../../../types';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { NoticeForm } from './NoticeForm';
import { NoticeList } from './NoticeList';

export function NoticeManager() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

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

  const handleSubmit = async (formData: { 
    title: { en: string; gu: string; }; 
    content: { en: string; gu: string; }; 
    images: string[]; 
    active: boolean;
    formatted_content?: { en: string; gu: string; };
  }) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      
      const user = JSON.parse(userStr);
      const noticeData = {
        ...formData,
        created_by: user.id
      };

      if (editingNotice) {
        // When updating, maintain the same order
        const { error } = await supabase
          .from('notices')
          .update({
            ...noticeData,
            order: editingNotice.order // Keep the original order
          })
          .eq('id', editingNotice.id);

        if (error) throw error;
        toast.success('Notice updated successfully');
      } else {
        // For new notices, add to the end
        const maxOrder = Math.max(...notices.map(n => n.order), -1);
        const { error } = await supabase
          .from('notices')
          .insert({
            ...noticeData,
            order: maxOrder + 1
          });

        if (error) throw error;
        toast.success('Notice created successfully');
      }

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
    
    // Swap positions
    const currentNotice = newNotices[currentIndex];
    const targetNotice = newNotices[newIndex];
    
    // Store original orders
    const currentOrder = currentNotice.order;
    const targetOrder = targetNotice.order;
    
    // Update orders in the array
    newNotices[currentIndex] = {...targetNotice, order: currentOrder};
    newNotices[newIndex] = {...currentNotice, order: targetOrder};

    try {
      // Create update objects with ALL required fields
      const updates = [
        {
          id: targetNotice.id,
          order: currentOrder,
          title: targetNotice.title,  // Preserve the title
          content: targetNotice.content,  // Preserve the content
          active: targetNotice.active, // Preserve active status
          // Add other required fields as needed
        },
        {
          id: currentNotice.id,
          order: targetOrder,
          title: currentNotice.title,  // Preserve the title
          content: currentNotice.content,  // Preserve the content
          active: currentNotice.active, // Preserve active status
          // Add other required fields as needed
        }
      ];

      const { error } = await supabase
        .from('notices')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
      setNotices(newNotices);
      toast.success('Notice order updated successfully');
    } catch (error) {
      console.error('Error reordering notices:', error);
      toast.error('Failed to reorder notices');
      loadNotices();
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
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Notice Board Manager</h2>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Notice
        </button>
      </div>

      {showForm && (
        <NoticeForm
          editingNotice={editingNotice}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingNotice(null);
          }}
        />
      )}

      <NoticeList
        notices={notices}
        onEdit={(notice) => {
          setEditingNotice(notice);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onMove={handleMove}
      />
    </div>
  );
}
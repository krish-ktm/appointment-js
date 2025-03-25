import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

interface Rule {
  id: string;
  title: {
    en: string;
    gu: string;
  };
  content: {
    en: string;
    gu: string;
  };
  display_order: number;
  updated_at: string;
}

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rule?: Rule;
  mode: 'add' | 'edit';
}

export default function AppointmentRuleModal({ isOpen, onClose, onSuccess, rule, mode }: RuleModalProps) {
  const [formData, setFormData] = useState({
    title: { en: '', gu: '' },
    content: { en: '', gu: '' },
    display_order: 0
  });

  useEffect(() => {
    if (mode === 'add') {
      setFormData({
        title: { en: '', gu: '' },
        content: { en: '', gu: '' },
        display_order: 0
      });
    } else if (rule) {
      setFormData({
        title: rule.title,
        content: rule.content,
        display_order: rule.display_order
      });
    }
  }, [rule, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('appointment_rules')
          .insert([{
            ...formData,
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Rule added successfully');
      } else {
        const { error } = await supabase
          .from('appointment_rules')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', rule?.id);

        if (error) throw error;
        toast.success('Rule updated successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error(mode === 'add' ? 'Failed to add rule' : 'Failed to update rule');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay with fade animation */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[9990] animate-fade-in" 
        aria-hidden="true" 
        onClick={onClose}
        style={{ margin: 0, padding: 0 }}
      />
      
      {/* Modal container with slide animation */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ margin: 0 }} onClick={onClose}>
        <div className="flex min-h-screen items-center justify-center p-4" onClick={e => e.stopPropagation()}>
          <div 
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-blue-600 px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-white">
                  {mode === 'add' ? 'Add New Rule' : 'Edit Rule'}
                </h3>
                <button
                  type="button"
                  className="bg-blue-600 rounded-md text-white hover:text-gray-200 focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      value={formData.title.en}
                      onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title (Gujarati)
                    </label>
                    <input
                      type="text"
                      value={formData.title.gu}
                      onChange={(e) => setFormData({ ...formData, title: { ...formData.title, gu: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content (English)
                    </label>
                    <textarea
                      value={formData.content.en}
                      onChange={(e) => setFormData({ ...formData, content: { ...formData.content, en: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content (Gujarati)
                    </label>
                    <textarea
                      value={formData.content.gu}
                      onChange={(e) => setFormData({ ...formData, content: { ...formData.content, gu: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {mode === 'add' ? 'Add Rule' : 'Update Rule'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
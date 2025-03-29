import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../i18n/LanguageContext';
import { Plus, Edit2, Trash2, AlertCircle, MoveUp, MoveDown, BookOpen, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatMarkdown } from '../../utils/markdown';
import clsx from 'clsx';

// Define the type for title and content
type MultilingualContent = {
  en: string;
  gu: string;
};

interface Rule {
  id: string;
  title: MultilingualContent;
  content: MultilingualContent;
  display_order: number;
  is_active: boolean;
  updated_at: string;
}

// Define prop types for form components
interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  required?: boolean;
}

interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function AppointmentRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newRule, setNewRule] = useState<{
    title: MultilingualContent;
    content: MultilingualContent;
    display_order: number;
    is_active: boolean;
  }>({
    title: { en: '', gu: '' },
    content: { en: '', gu: '' },
    display_order: 0,
    is_active: true
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_rules')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error loading rules:', error);
      toast.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointment_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Rule deleted successfully');
      setDeleteConfirm(null);
      loadRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete rule');
    }
  };

  const handleEdit = (rule: Rule) => {
    setEditingId(rule.id);
    setEditingRule({ ...rule });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingRule(null);
  };

  const handleSaveEdit = async () => {
    if (!editingRule) return;
    
    try {
      const { error } = await supabase
        .from('appointment_rules')
        .update({
          title: editingRule.title,
          content: editingRule.content,
          display_order: editingRule.display_order,
          is_active: editingRule.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingRule.id);

      if (error) throw error;
      
      toast.success('Rule updated successfully');
      setEditingId(null);
      setEditingRule(null);
      loadRules();
    } catch (error) {
      console.error('Error updating rule:', error);
      toast.error('Failed to update rule');
    }
  };

  const handleAddNew = async () => {
    try {
      const { error } = await supabase
        .from('appointment_rules')
        .insert({
          title: newRule.title,
          content: newRule.content,
          display_order: newRule.display_order,
          is_active: newRule.is_active,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Rule added successfully');
      setShowAddNew(false);
      setNewRule({
        title: { en: '', gu: '' },
        content: { en: '', gu: '' },
        display_order: 0,
        is_active: true
      });
      loadRules();
    } catch (error) {
      console.error('Error adding rule:', error);
      toast.error('Failed to add rule');
    }
  };

  const handleToggleActive = async (rule: Rule) => {
    try {
      const { error } = await supabase
        .from('appointment_rules')
        .update({
          is_active: !rule.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', rule.id);

      if (error) throw error;
      
      toast.success(`Rule ${rule.is_active ? 'deactivated' : 'activated'} successfully`);
      loadRules();
    } catch (error) {
      console.error('Error toggling rule status:', error);
      toast.error('Failed to update rule status');
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = rules.findIndex(rule => rule.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === rules.length - 1)
    ) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newRules = [...rules];
    
    const currentRule = newRules[currentIndex];
    const targetRule = newRules[newIndex];
    
    const currentOrder = currentRule.display_order;
    const targetOrder = targetRule.display_order;
    
    newRules[currentIndex] = { ...targetRule, display_order: currentOrder };
    newRules[newIndex] = { ...currentRule, display_order: targetOrder };

    try {
      const { error } = await supabase
        .from('appointment_rules')
        .upsert([
          {
            id: targetRule.id,
            display_order: currentOrder,
            title: targetRule.title,
            content: targetRule.content,
            is_active: targetRule.is_active,
            updated_at: new Date().toISOString()
          },
          {
            id: currentRule.id,
            display_order: targetOrder,
            title: currentRule.title,
            content: currentRule.content,
            is_active: currentRule.is_active,
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      setRules(newRules);
      toast.success('Rule order updated successfully');
    } catch (error) {
      console.error('Error reordering rules:', error);
      toast.error('Failed to reorder rules');
      loadRules();
    }
  };

  const FormInput = ({ label, value, onChange, type = 'text', className = '', ...props }: FormInputProps) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        {...props}
      />
    </div>
  );

  const FormTextarea = ({ label, value, onChange, className = '', rows = 3, ...props }: FormTextareaProps) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        rows={rows}
        {...props}
      />
      <div className="mt-1 text-xs text-gray-500">
        Supports markdown formatting: **bold**, *italic*, [link](url), - list items
      </div>
    </div>
  );

  const FormCheckbox = ({ label, checked, onChange, className = '', ...props }: FormCheckboxProps) => (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        {...props}
      />
      <label className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );

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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Rules</h2>
          <p className="mt-1 text-sm text-gray-500">Manage and organize rules for appointments</p>
        </div>
        <button
          onClick={() => setShowAddNew(prev => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      {/* Add New Rule Form */}
      {showAddNew && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-xl border border-blue-100 p-6 shadow-sm mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Rule</h3>
            <button
              onClick={() => setShowAddNew(false)}
              className="p-1 hover:bg-blue-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Title (English)"
                value={newRule.title.en}
                onChange={(e) => 
                  setNewRule(prev => ({ 
                    ...prev, 
                    title: { ...prev.title, en: e.target.value } 
                  }))}
                required
              />
              <FormInput
                label="Title (Gujarati)"
                value={newRule.title.gu}
                onChange={(e) => 
                  setNewRule(prev => ({ 
                    ...prev, 
                    title: { ...prev.title, gu: e.target.value } 
                  }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormTextarea
                label="Content (English)"
                value={newRule.content.en}
                onChange={(e) => 
                  setNewRule(prev => ({ 
                    ...prev, 
                    content: { ...prev.content, en: e.target.value } 
                  }))}
                rows={4}
                required
              />
              <FormTextarea
                label="Content (Gujarati)"
                value={newRule.content.gu}
                onChange={(e) => 
                  setNewRule(prev => ({ 
                    ...prev, 
                    content: { ...prev.content, gu: e.target.value } 
                  }))}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Display Order"
                type="number"
                value={newRule.display_order}
                onChange={(e) => 
                  setNewRule(prev => ({ 
                    ...prev, 
                    display_order: parseInt(e.target.value) 
                  }))}
                min={0}
              />
              <FormCheckbox
                label="Active"
                checked={newRule.is_active}
                onChange={(e) => 
                  setNewRule(prev => ({ 
                    ...prev, 
                    is_active: e.target.checked 
                  }))}
                className="mt-7"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Save Rule
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {rules.length === 0 && !showAddNew && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">No rules yet</h3>
                <p className="text-sm text-gray-500 mt-1">Get started by adding your first appointment rule</p>
              </div>
              <button
                onClick={() => setShowAddNew(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Your First Rule
              </button>
            </div>
          </div>
        )}

        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={clsx(
              "bg-white rounded-xl border transition-all duration-300",
              editingId === rule.id 
                ? "border-blue-300 shadow-md" 
                : "border-gray-200 shadow-sm hover:shadow-md"
            )}
          >
            {editingId === rule.id ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Title (English)"
                    value={editingRule?.title.en || ''}
                    onChange={(e) => 
                      setEditingRule(prev => prev ? {
                        ...prev,
                        title: { ...prev.title, en: e.target.value }
                      } : null)}
                    required
                  />
                  <FormInput
                    label="Title (Gujarati)"
                    value={editingRule?.title.gu || ''}
                    onChange={(e) => 
                      setEditingRule(prev => prev ? {
                        ...prev,
                        title: { ...prev.title, gu: e.target.value }
                      } : null)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormTextarea
                    label="Content (English)"
                    value={editingRule?.content.en || ''}
                    onChange={(e) => 
                      setEditingRule(prev => prev ? {
                        ...prev,
                        content: { ...prev.content, en: e.target.value }
                      } : null)}
                    rows={4}
                    required
                  />
                  <FormTextarea
                    label="Content (Gujarati)"
                    value={editingRule?.content.gu || ''}
                    onChange={(e) => 
                      setEditingRule(prev => prev ? {
                        ...prev,
                        content: { ...prev.content, gu: e.target.value }
                      } : null)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Display Order"
                    type="number"
                    value={editingRule?.display_order || 0}
                    onChange={(e) => 
                      setEditingRule(prev => prev ? {
                        ...prev,
                        display_order: parseInt(e.target.value)
                      } : null)}
                    min={0}
                  />
                  <FormCheckbox
                    label="Active"
                    checked={editingRule?.is_active || false}
                    onChange={(e) => 
                      setEditingRule(prev => prev ? {
                        ...prev,
                        is_active: e.target.checked
                      } : null)}
                    className="mt-7"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {rule.title[language]}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rule.is_active 
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' 
                          : 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20'
                      }`}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div 
                      className="prose prose-sm max-w-none text-gray-600"
                      dangerouslySetInnerHTML={{ 
                        __html: formatMarkdown(rule.content[language]) 
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => handleMove(rule.id, 'up')}
                        disabled={index === 0}
                        className={`p-1.5 rounded-md hover:bg-white hover:shadow-sm ${
                          index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Move Up"
                      >
                        <MoveUp className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleMove(rule.id, 'down')}
                        disabled={index === rules.length - 1}
                        className={`p-1.5 rounded-md hover:bg-white hover:shadow-sm ${
                          index === rules.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Move Down"
                      >
                        <MoveDown className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => handleEdit(rule)}
                        className="p-1.5 rounded-md hover:bg-white hover:shadow-sm"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(rule.id)}
                        className="p-1.5 rounded-md hover:bg-white hover:shadow-sm"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggleActive(rule)}
                      className={`ml-1 p-1.5 rounded-md text-xs font-medium ${
                        rule.is_active 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {rule.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
                {deleteConfirm === rule.id && (
                  <div className="p-4 border-t border-gray-200 bg-red-50/50">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-sm font-medium text-gray-900">Are you sure you want to delete this rule?</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
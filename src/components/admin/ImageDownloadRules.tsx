import React from 'react';
import { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, X, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface ImageDownloadRule {
  id: string;
  type: 'patient' | 'mr';
  title: Record<string, string>;
  content: Record<string, string>;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ImageDownloadRulesProps {
  type: 'patient' | 'mr';
}

const FormInput = memo(({ label, value, onChange, type = 'text', className = '', ...props }: any) => (
  <motion.div 
    className={className}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
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
  </motion.div>
));

FormInput.displayName = 'FormInput';

const FormTextarea = memo(({ label, value, onChange, className = '', ...props }: any) => (
  <motion.div 
    className={className}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      {...props}
    />
  </motion.div>
));

FormTextarea.displayName = 'FormTextarea';

export default function ImageDownloadRules({ type }: ImageDownloadRulesProps) {
  const [rules, setRules] = useState<ImageDownloadRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<ImageDownloadRule | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newRule, setNewRule] = useState<Partial<ImageDownloadRule>>({
    type,
    title: { en: 'Important Notes', gu: 'મહત્વપૂર્ણ નોંધ' },
    content: { en: '', gu: '' },
    order: 1,
    is_active: true
  });

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('image_download_rules')
        .select('*')
        .eq('type', type)
        .order('order', { ascending: true });

      if (error) throw error;
      
      setRules(data || []);
    } catch (error: unknown) {
      console.error('Error fetching rules:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleEdit = useCallback((rule: ImageDownloadRule) => {
    setEditingId(rule.id);
    setEditingRule({ ...rule });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingRule(null);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingRule) return;
    
    try {
      const { error } = await supabase
        .from('image_download_rules')
        .update({
          title: editingRule.title,
          content: editingRule.content,
          order: editingRule.order,
          is_active: editingRule.is_active
        })
        .eq('id', editingRule.id);

      if (error) throw error;
      
      toast.success('Rule updated successfully');
      setEditingId(null);
      setEditingRule(null);
      fetchRules();
    } catch (error: unknown) {
      console.error('Error updating rule:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to update rule');
    }
  }, [editingRule, fetchRules]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    
    try {
      const { error } = await supabase
        .from('image_download_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Rule deleted successfully');
      fetchRules();
    } catch (error: unknown) {
      console.error('Error deleting rule:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to delete rule');
    }
  }, [fetchRules]);

  const handleAddNew = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('image_download_rules')
        .insert({
          type,
          title: newRule.title,
          content: newRule.content,
          order: newRule.order,
          is_active: newRule.is_active
        });

      if (error) throw error;
      
      toast.success('Rule added successfully');
      setShowAddNew(false);
      setNewRule({
        type,
        title: { en: 'Important Notes', gu: 'મહત્વપૂર્ણ નોંધ' },
        content: { en: '', gu: '' },
        order: 1,
        is_active: true
      });
      fetchRules();
    } catch (error: unknown) {
      console.error('Error adding rule:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to add rule');
    }
  }, [fetchRules, newRule, type]);

  const handleEditingRuleChange = useCallback((field: string, subField: string | null, value: any) => {
    setEditingRule(prev => {
      if (!prev) return prev;

      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof ImageDownloadRule],
            [subField]: value
          }
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  const handleNewRuleChange = useCallback((field: string, subField: string | null, value: any) => {
    setNewRule(prev => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof Partial<ImageDownloadRule>],
            [subField]: value
          }
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  if (loading) {
    return (
      <motion.div 
        className="min-h-[400px] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center gap-3">
          <motion.div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sm text-gray-500">Loading rules...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Image Download Rules
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {type === 'patient' ? 'Regular Appointments' : 'MR Appointments'}
            </p>
          </div>
          <motion.button
            onClick={() => setShowAddNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transform active:scale-95 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} /> Add Rule
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div className="divide-y divide-gray-100">
          {rules.length === 0 && !showAddNew && (
            <motion.div 
              className="px-6 py-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col items-center gap-3">
                <AlertCircle size={24} className="text-gray-400" />
                <div>
                  <p className="text-gray-600 font-medium">No rules found</p>
                  <p className="text-sm text-gray-500 mt-1">Click "Add Rule" to create your first rule</p>
                </div>
              </div>
            </motion.div>
          )}

          {rules.map(rule => (
            <motion.div 
              key={rule.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={clsx(
                "px-6 py-6 transition-all duration-300 ease-in-out transform",
                editingId === rule.id ? "bg-blue-50" : "hover:bg-gray-50"
              )}
            >
              {editingId === rule.id ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Title (English)"
                      value={editingRule?.title?.en || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditingRuleChange('title', 'en', e.target.value)
                      }
                    />
                    <FormInput
                      label="Title (Gujarati)"
                      value={editingRule?.title?.gu || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditingRuleChange('title', 'gu', e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormTextarea
                      label="Content (English)"
                      value={editingRule?.content?.en || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        handleEditingRuleChange('content', 'en', e.target.value)
                      }
                      rows={4}
                      placeholder="Use markdown format with '-' for bullet points"
                    />
                    <FormTextarea
                      label="Content (Gujarati)"
                      value={editingRule?.content?.gu || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        handleEditingRuleChange('content', 'gu', e.target.value)
                      }
                      rows={4}
                      placeholder="Use markdown format with '-' for bullet points"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <FormInput
                      label="Display Order"
                      type="number"
                      value={editingRule?.order || 0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditingRuleChange('order', null, parseInt(e.target.value) || 0)
                      }
                      className="w-36"
                    />

                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        id={`active-${rule.id}`}
                        checked={editingRule?.is_active || false}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleEditingRuleChange('is_active', null, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                      />
                      <label htmlFor={`active-${rule.id}`} className="ml-2 text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <motion.button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transform active:scale-95 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transform active:scale-95 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-medium text-gray-900">
                          {rule.title?.en || 'Important Notes'}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            "text-xs px-2 py-1 rounded-full font-medium transition-all duration-200",
                            rule.is_active 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-600"
                          )}>
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                            Order: {rule.order}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {rule.title?.gu || 'મહત્વપૂર્ણ નોંધ'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <motion.button
                        onClick={() => handleEdit(rule)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transform active:scale-90 transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(rule.id)}
                        className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transform active:scale-90 transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">English Content</h5>
                      <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:border-gray-200">
                        {rule.content?.en || 'No content'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Gujarati Content</h5>
                      <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:border-gray-200">
                        {rule.content?.gu || 'No content'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {showAddNew && (
            <motion.div 
              className="px-6 py-6 bg-blue-50 space-y-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Add New Rule</h3>
                <motion.button
                  onClick={() => setShowAddNew(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-blue-100 transform active:scale-90 transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Title (English)"
                  value={newRule.title?.en || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleNewRuleChange('title', 'en', e.target.value)
                  }
                />
                <FormInput
                  label="Title (Gujarati)"
                  value={newRule.title?.gu || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleNewRuleChange('title', 'gu', e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormTextarea
                  label="Content (English)"
                  value={newRule.content?.en || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleNewRuleChange('content', 'en', e.target.value)
                  }
                  rows={4}
                  placeholder="- Please arrive 10 minutes before your appointment time&#10;- Bring your previous medical records&#10;- Wear a mask during your visit"
                />
                <FormTextarea
                  label="Content (Gujarati)"
                  value={newRule.content?.gu || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleNewRuleChange('content', 'gu', e.target.value)
                  }
                  rows={4}
                  placeholder="- કૃપા કરી તમારી એપોઈન્ટમેન્ટના સમયથી 10 મિનિટ પહેલા આવો&#10;- તમારા અગાઉના મેડિકલ રેકોર્ડ્સ લાવો&#10;- તમારી મુલાકાત દરમિયાન માસ્ક પહેરો"
                />
              </div>

              <div className="flex items-center gap-6">
                <FormInput
                  label="Display Order"
                  type="number"
                  value={newRule.order || 1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleNewRuleChange('order', null, parseInt(e.target.value) || 1)
                  }
                  className="w-36"
                />

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="new-active"
                    checked={newRule.is_active || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleNewRuleChange('is_active', null, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                  />
                  <label htmlFor="new-active" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <motion.button
                  onClick={handleAddNew}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transform active:scale-95 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Rule
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
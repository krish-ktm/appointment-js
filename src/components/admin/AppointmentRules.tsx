import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../i18n/LanguageContext';
import { Plus, Edit2, Trash2, AlertCircle, MoveUp, MoveDown, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatMarkdown } from '../../utils/markdown';
import AppointmentRuleModal from './rules/AppointmentRuleModal';

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
  is_active: boolean;
  updated_at: string;
}

export default function AppointmentRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
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
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      <div className="grid gap-4">
        {rules.length === 0 && !showForm && (
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
                onClick={() => setShowForm(true)}
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
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
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
                    >
                      <MoveUp className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleMove(rule.id, 'down')}
                      disabled={index === rules.length - 1}
                      className={`p-1.5 rounded-md hover:bg-white hover:shadow-sm ${
                        index === rules.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <MoveDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => {
                        setEditingRule(rule);
                        setShowForm(true);
                      }}
                      className="p-1.5 rounded-md hover:bg-white hover:shadow-sm"
                    >
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(rule.id)}
                      className="p-1.5 rounded-md hover:bg-white hover:shadow-sm"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AppointmentRuleModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingRule(null);
        }}
        onSuccess={loadRules}
        rule={editingRule}
        mode={editingRule ? 'edit' : 'add'}
      />

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Rule</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this rule? This action cannot be undone.
                  </p>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white border border-gray-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../i18n/LanguageContext';
import { Plus, X, Edit2, Trash2, AlertCircle, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
  updated_at: string;
}

export default function AppointmentRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_rules')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast.error('Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: Rule) => {
    setSelectedRule(rule);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedRule(undefined);
    setModalMode('add');
    setIsModalOpen(true);
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
      fetchRules();
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
    
    // Swap positions
    const currentRule = newRules[currentIndex];
    const targetRule = newRules[newIndex];
    
    // Store original orders
    const currentOrder = currentRule.display_order;
    const targetOrder = targetRule.display_order;
    
    // Update orders in the array
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
            updated_at: new Date().toISOString()
          },
          {
            id: currentRule.id,
            display_order: targetOrder,
            title: currentRule.title,
            content: currentRule.content,
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      setRules(newRules);
      toast.success('Rule order updated successfully');
    } catch (error) {
      console.error('Error reordering rules:', error);
      toast.error('Failed to reorder rules');
      fetchRules(); // Refresh the list on error
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
        <h2 className="text-2xl font-bold text-gray-900">Appointment Rules</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Rule
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {rules.length === 0 ? (
            <li className="p-8 text-center text-gray-500">
              No rules found. Click "Add New Rule" to create one.
            </li>
          ) : (
            rules.map((rule, index) => (
              <motion.li
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        {rule.title[language]}
                      </h3>
                      <p className="mt-1 text-gray-600">
                        {rule.content[language]}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        Last updated: {new Date(rule.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleMove(rule.id, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded-lg hover:bg-gray-100 ${
                        index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <MoveUp className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleMove(rule.id, 'down')}
                      disabled={index === rules.length - 1}
                      className={`p-1 rounded-lg hover:bg-gray-100 ${
                        index === rules.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <MoveDown className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-1 rounded-lg hover:bg-gray-100"
                    >
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(rule.id)}
                      className="p-1 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>

                    {/* Delete Confirmation Popover */}
                    <AnimatePresence>
                      {deleteConfirm === rule.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div className="bg-red-50 p-2 rounded-lg flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Confirm Delete</h4>
                              <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete this rule?</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(rule.id)}
                              className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.li>
            ))
          )}
        </ul>
      </div>

      <AppointmentRuleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRule(undefined);
        }}
        onSuccess={fetchRules}
        rule={selectedRule}
        mode={modalMode}
      />
    </div>
  );
}
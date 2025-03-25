import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../i18n/LanguageContext';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppointmentRuleModal from './rules/AppointmentRuleModal';
import AppointmentRuleItem from './rules/AppointmentRuleItem';

// Types for our components
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRule(undefined);
  };

  const updateRuleOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('appointment_rules')
        .update({ 
          display_order: newOrder,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Rule order updated successfully');
      fetchRules();
    } catch (error) {
      console.error('Error updating rule order:', error);
      toast.error('Failed to update rule order');
    }
  };

  const deleteRule = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('appointment_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Rule deleted successfully');
      fetchRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete rule');
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

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {rules.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No rules found. Click "Add New Rule" to create one.
          </div>
        ) : (
          rules.map((rule, index) => (
            <AppointmentRuleItem
              key={rule.id}
              rule={rule}
              language={language}
              onEdit={handleEdit}
              onDelete={deleteRule}
              onMoveUp={updateRuleOrder}
              onMoveDown={updateRuleOrder}
              isFirst={index === 0}
              isLast={index === rules.length - 1}
            />
          ))
        )}
      </div>

      <AppointmentRuleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchRules}
        rule={selectedRule}
        mode={modalMode}
      />
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { Trash2 } from 'lucide-react';

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
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function AppointmentRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_rules')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedContent = (content: { en: string; gu: string }, lang: 'en' | 'gu'): string => {
    return content[lang];
  };

  const toggleRuleStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('appointment_rules')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setRules(rules.map(rule => 
        rule.id === id 
          ? { ...rule, is_active: isActive, updated_at: new Date().toISOString() }
          : rule
      ));
    } catch (error) {
      console.error('Error toggling rule status:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;

    try {
      const { error } = await supabase
        .from('appointment_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setRules(rules.filter(rule => rule.id !== id));
    } catch (error) {
      console.error('Error deleting rule:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) return null;

  if (rules.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {language === 'en' ? 'Important Information' : 'મહત્વપૂર્ણ માહિતી'}
      </h3>
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getLocalizedContent(rule.title, language)}
                </h3>
                <p className="mt-2 text-gray-600">
                  {getLocalizedContent(rule.content, language)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRuleStatus(rule.id, !rule.is_active)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    rule.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {rule.is_active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Last updated: {new Date(rule.updated_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
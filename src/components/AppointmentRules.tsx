import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

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

  if (loading) return null;

  if (rules.length === 0) return null;

  return (
    <div className="bg-green-100 p-6 rounded-lg shadow-md">
      {rules.map((rule) => (
        <p key={rule.id} className="text-gray-600 mb-4">
          {getLocalizedContent(rule.content, language)}
        </p>
      ))}
    </div>
  );
} 
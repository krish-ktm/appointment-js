import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Notice } from '../types';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { HeroSection } from './landing/HeroSection';
import { ServicesSection } from './landing/ServicesSection';
import { NoticeBoard } from './landing/NoticeBoard';
import { WhyChooseUs } from './landing/WhyChooseUs';
import { StatsSection } from './landing/StatsSection';
import { useTranslation } from '../i18n/useTranslation';

export function LandingPage() {
  const { t } = useTranslation();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('active', true)
        .order('order', { ascending: true });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error loading notices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <ResponsiveHeader />
      
      <HeroSection t={t.home.hero} />
      
      <ServicesSection t={t.services} />
      <WhyChooseUs t={t.whyChooseUs} />
      <NoticeBoard notices={notices} loading={loading} />
      <StatsSection t={t.home.stats} />

      <Footer />
    </div>
  );
}
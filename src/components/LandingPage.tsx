import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import { Notice } from '../types';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Phone, Star, Shield, Award, ArrowRight } from 'lucide-react';

// Lazy load sections that are below the fold
const LazyServicesSection = lazy(() => import('./landing/ServicesSection').then(module => ({ default: module.ServicesSection })));
const LazyNoticeBoard = lazy(() => import('./landing/NoticeBoard').then(module => ({ default: module.NoticeBoard })));
const LazyTestimonialsSection = lazy(() => import('./landing/TestimonialsSection').then(module => ({ default: module.TestimonialsSection })));

export function LandingPage() {
  const { t } = useTranslation();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

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

  // Animation variants
  const fadeInUp = {
    hidden: { 
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Loading placeholder
  const LoadingPlaceholder = () => (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  // Features list for hero section
  const features = [
    {
      icon: Star,
      title: "14+ Years Experience",
      color: "text-yellow-400 bg-yellow-100/10",
      borderColor: "border-yellow-400/20"
    },
    {
      icon: Shield,
      title: "Expert Care",
      color: "text-blue-400 bg-blue-100/10",
      borderColor: "border-blue-400/20"
    },
    {
      icon: Award,
      title: "Advanced Treatments",
      color: "text-emerald-400 bg-emerald-100/10",
      borderColor: "border-emerald-400/20"
    }
  ];

  // Clinic benefits
  const benefits = [
    {
      icon: CheckCircle,
      title: 'Expert Dermatology Care',
      description: 'Specialized care for all skin conditions with personalized treatment plans'
    },
    {
      icon: CheckCircle,
      title: 'Advanced Treatment Options',
      description: 'State-of-the-art procedures and equipment for optimal results'
    },
    {
      icon: CheckCircle,
      title: 'Patient-Centered Approach',
      description: 'Compassionate care tailored to your unique needs and concerns'
    },
    {
      icon: CheckCircle,
      title: 'Comprehensive Skin Solutions',
      description: 'From medical treatments to aesthetic procedures, all in one place'
    }
  ];

  // Clinic info cards
  const clinicInfo = [
    {
      icon: Calendar,
      title: 'Convenient Appointment Scheduling',
      description: 'Book your appointments easily online'
    },
    {
      icon: Clock,
      title: 'Extended Office Hours',
      description: 'Morning and evening slots available'
    },
    {
      icon: MapPin,
      title: 'Central Location',
      description: 'Easy to reach with nearby parking'
    },
    {
      icon: Phone,
      title: 'Direct Patient Support',
      description: 'Quick response to all your queries'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <ResponsiveHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-blue-800 pt-16 pb-32 lg:pt-24 lg:pb-40">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/4 -translate-y-1/4 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
          <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 -translate-x-1/4 translate-y-1/4 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-blue-700/50 backdrop-blur-sm border border-blue-600/30">
                <Calendar className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium text-blue-100">Dr. Jemish A. Patel - MBBS, MD</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Expert Dermatological Care for Your Skin Health
              </h1>
              
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                Comprehensive skin treatments with advanced technology and personalized care plans
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${feature.borderColor}`}
                  >
                    <feature.icon className={`h-4 w-4 ${feature.color}`} />
                    <span className="text-sm font-medium text-white">{feature.title}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/appointment"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium flex items-center justify-center gap-2 hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Book Appointment
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  to="/mr-appointment"
                  className="px-6 py-3 rounded-lg bg-blue-700/30 backdrop-blur-sm border border-blue-600/30 text-white font-medium flex items-center justify-center gap-2 hover:bg-blue-700/50 transition-all"
                >
                  Medical Representative Appointment
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="hidden lg:block relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full h-[550px]">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-700/20 to-blue-900/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src="/gallery/doctor.png" 
                    alt="Doctor" 
                    className="absolute bottom-0 right-0 max-h-[550px] object-contain z-10"
                    style={{ filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))' }}
                  />
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                    style={{ backgroundImage: 'url(/gallery/doctor-office.JPG)' }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Clinic Benefits Section */}
      <motion.section 
        className="py-24 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Dermatology Clinic
            </h2>
            <p className="text-lg text-gray-600">
              Providing exceptional dermatological care with a focus on patient satisfaction and clinical excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-3 bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 flex-grow">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Services Overview */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <LazyServicesSection t={t?.services || {}} />
        </motion.div>
      </Suspense>
      
      {/* Call to Action */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        {/* Background shape */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-400 opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Experience our expert dermatological care today
            </p>
            <Link
              to="/appointment"
              className="px-8 py-4 rounded-lg bg-white text-blue-700 font-medium text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      </motion.section>
      
      {/* Clinic Info Cards */}
      <motion.section
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Clinic Information
            </h2>
            <p className="text-lg text-gray-600">
              We strive to make your visit convenient and comfortable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clinicInfo.map((info, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-3 bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <info.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Testimonials Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <LazyTestimonialsSection />
      </Suspense>
      
      {/* Notices Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <LazyNoticeBoard notices={notices} loading={loading} />
      </Suspense>

      <Footer />
    </div>
  );
}
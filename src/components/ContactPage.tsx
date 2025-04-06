import { motion } from 'framer-motion';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { Phone, Mail, MapPin, Clock, Send, Shield } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useTranslation } from '../i18n/useTranslation';
import { businessInfo } from '../config/business';

export function ContactPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message
        });

      if (error) throw error;

      toast.success(t.contact.form.success);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t.contact.form.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2B5C4B]/5 via-white to-[#2B5C4B]/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl" />
      </div>

      <ResponsiveHeader />
      
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              {t.contact.tagline}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5c] mb-4 sm:mb-6"
            >
              {t.contact.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto"
            >
              {t.contact.subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
                  <h2 className="text-xl font-semibold text-white">{t.contact.contactInfo.title}</h2>
                  <p className="text-white/80 mt-1">{t.contact.contactInfo.subtitle}</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <a
                    href={`tel:${businessInfo.contact.phone}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl group-hover:bg-[#2B5C4B]/10 transition-colors">
                      <Phone className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.contact.contactInfo.phone.label}</p>
                      <p className="font-medium text-gray-900">{businessInfo.contact.phone}</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${businessInfo.contact.email}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl group-hover:bg-[#2B5C4B]/10 transition-colors">
                      <Mail className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.contact.contactInfo.email.label}</p>
                      <p className="font-medium text-gray-900">{businessInfo.contact.email}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl group-hover:bg-[#2B5C4B]/10 transition-colors">
                      <MapPin className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.contact.contactInfo.address.label}</p>
                      <p className="font-medium text-gray-900">{businessInfo.contact.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl group-hover:bg-[#2B5C4B]/10 transition-colors">
                      <Clock className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.contact.contactInfo.hours.label}</p>
                      <p className="font-medium text-gray-900">
                        Mon-Fri: {businessInfo.hours.weekday.morning} | {businessInfo.hours.weekday.evening}
                      </p>
                      <p className="font-medium text-gray-900">Sat: {businessInfo.hours.saturday}</p>
                      <p className="font-medium text-gray-900">Sun: {businessInfo.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
                  <h2 className="text-xl font-semibold text-white">{t.contact.form.title}</h2>
                  <p className="text-white/80 mt-1">{t.contact.form.subtitle}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.contact.form.name.label}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-colors"
                      placeholder={t.contact.form.name.placeholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.contact.form.email.label}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-colors"
                      placeholder={t.contact.form.email.placeholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.contact.form.phone.label}
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-colors"
                      placeholder={t.contact.form.phone.placeholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.contact.form.message.label}
                    </label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-colors resize-none"
                      placeholder={t.contact.form.message.placeholder}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-[#2B5C4B] text-white rounded-xl hover:bg-[#234539] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t.contact.form.sending}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t.contact.form.submit}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
                <h2 className="text-xl font-semibold text-white">{t.contact.map.title}</h2>
                <p className="text-white/80 mt-1">{t.contact.map.subtitle}</p>
              </div>
              <div className="h-80 lg:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.7069132880295!2d72.65333107594439!3d23.03402901551698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e873f2553abb9%3A0xd5e4acca2a55e32d!2sDr%20Jemish%20Skin%20Care!5e0!3m2!1sen!2sin!4v1712495293913!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
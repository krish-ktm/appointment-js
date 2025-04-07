import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  const scrollToAppointmentForm = () => {
    const element = document.querySelector('.appointment-form-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#appointment-form';
    }
  };

  return (
    <footer className="relative bg-[#2B5C4B] text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 bg-clip-text text-white font-heading">
              {t.footer.clinicName}
            </h3>
            <p className="text-white/80 leading-relaxed text-sm font-sans">
              {t.footer.description}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white font-heading">{t.footer.quickLinks.title}</h3>
            <ul className="space-y-3">
              {[
                { label: t.footer.quickLinks.home, to: "/" },
                { label: t.footer.quickLinks.about, to: "/about" },
                { label: t.footer.quickLinks.services, to: "/services" },
                { label: t.footer.quickLinks.gallery, to: "/gallery" },
                { label: t.footer.quickLinks.contact, to: "/contact" },
                { label: t.footer.quickLinks.bookAppointment, action: scrollToAppointmentForm },
                { label: t.footer.quickLinks.mrAppointment, to: "/mr-appointment" }
              ].map((link, index) => (
                <li key={index}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm font-sans"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={link.action}
                      className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm font-sans"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white font-heading">{t.footer.contactInfo.title}</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${t.footer.contactInfo.phone}`}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200 group font-sans"
                >
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-sans">{t.footer.contactInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${t.footer.contactInfo.email}`}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200 group font-sans"
                >
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-sans">{t.footer.contactInfo.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/80 group font-sans">
                <div className="bg-white/10 p-2 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-sans">{t.footer.contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 group font-sans">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-sm font-sans">{t.footer.contactInfo.hours}</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white font-heading">{t.footer.social.title}</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200 group font-sans"
                    whileHover={{ x: 4 }}
                  >
                    <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-sans">{social.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-white/10 mt-16 pt-8 text-center"
        >
          <p className="text-white/60 text-sm font-sans">
            {t.footer.copyright}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
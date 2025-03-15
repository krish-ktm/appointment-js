import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { text, background } from '../theme/colors';
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
    <footer className={`bg-gradient-to-b ${background.light} border-t border-gray-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">
              {t.footer.clinicName}
            </h3>
            <p className={`${text.secondary} leading-relaxed`}>
              {t.footer.description}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className={`text-lg font-semibold mb-6 ${text.primary}`}>{t.footer.quickLinks.title}</h3>
            <ul className="space-y-3">
              {[
                { label: t.footer.quickLinks.home, to: "/" },
                { label: t.footer.quickLinks.about, to: "/about" },
                { label: t.footer.quickLinks.services, to: "/services" },
                { label: t.footer.quickLinks.bookAppointment, action: scrollToAppointmentForm },
                { label: t.footer.quickLinks.mrAppointment, to: "/mr-appointment" }
              ].map((link, index) => (
                <li key={index}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className={`${text.secondary} hover:text-blue-600 transition-colors duration-200 flex items-center gap-2`}
                    >
                      <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={link.action}
                      className={`${text.secondary} hover:text-blue-600 transition-colors duration-200 flex items-center gap-2`}
                    >
                      <span className="h-1 w-1 rounded-full bg-blue-500"></span>
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className={`text-lg font-semibold mb-6 ${text.primary}`}>{t.footer.contactInfo.title}</h3>
            <ul className="space-y-4">
              <li className={`flex items-center gap-3 ${text.secondary} hover:text-blue-600 transition-colors duration-200`}>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-500" />
                </div>
                <span>{t.footer.contactInfo.phone}</span>
              </li>
              <li className={`flex items-center gap-3 ${text.secondary} hover:text-blue-600 transition-colors duration-200`}>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>
                <span>{t.footer.contactInfo.email}</span>
              </li>
              <li className={`flex items-center gap-3 ${text.secondary} hover:text-blue-600 transition-colors duration-200`}>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-500" />
                </div>
                <span>{t.footer.contactInfo.address}</span>
              </li>
              <li className={`flex items-center gap-3 ${text.secondary} hover:text-blue-600 transition-colors duration-200`}>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <span>{t.footer.contactInfo.hours}</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className={`text-lg font-semibold mb-6 ${text.primary}`}>{t.footer.social.title}</h3>
            <div className="flex gap-4">
              {[
                { icon: Facebook, color: "hover:bg-blue-600", href: "#" },
                { icon: Twitter, color: "hover:bg-blue-400", href: "#" },
                { icon: Instagram, color: "hover:bg-pink-600", href: "#" },
                { icon: Linkedin, color: "hover:bg-blue-700", href: "#" }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`bg-blue-50 p-3 rounded-xl ${social.color} hover:text-white transition-colors duration-300`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5 text-blue-500" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-100 mt-16 pt-8 text-center"
        >
          <p className={text.secondary}>
            {t.footer.copyright}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
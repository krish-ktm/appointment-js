import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Phone, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gu' : 'en');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed w-full z-50">
      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <Link 
              to="/" 
              className="text-base font-bold text-[#2B5C4B]"
            >
              {t.header.clinicName}
            </Link>

            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <div className="relative">
                <motion.button
                  onClick={toggleLanguage}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-16 h-7 rounded-full bg-gray-100 p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 hover:bg-gray-200 group"
                >
                  <motion.div
                    animate={{
                      x: language === 'en' ? 36 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-1 left-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#2B5C4B] to-[#234539] shadow-lg shadow-[#2B5C4B]/10 flex items-center justify-center"
                  >
                    <span className="text-[10px] font-semibold text-white">
                      {language === 'en' ? 'En' : 'ગુ'}
                    </span>
                  </motion.div>
                  <div className="relative z-10 flex justify-between px-1.5 text-[10px] font-medium h-full items-center">
                    <span className={`transition-colors duration-300 ${
                      language === 'gu' ? 'text-[#2B5C4B] font-semibold' : 'text-gray-400'
                    }`}>
                      ગુ
                    </span>
                    <span className={`transition-colors duration-300 ${
                      language === 'en' ? 'text-[#2B5C4B] font-semibold' : 'text-gray-400'
                    }`}>
                      En
                    </span>
                  </div>
                </motion.button>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-[#2B5C4B] hover:bg-[#2B5C4B]/5 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {[
                { path: '/', label: t.navigation.home },
                { path: '/about', label: t.navigation.about },
                { path: '/services', label: t.navigation.services },
                { path: '/gallery', label: t.navigation.gallery },
                { path: '/mr-appointment', label: t.navigation.mrAppointment }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                    isActive(item.path) 
                      ? 'bg-[#2B5C4B]/5 text-[#2B5C4B]' 
                      : 'text-gray-600 hover:text-[#2B5C4B] hover:bg-[#2B5C4B]/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                to="/appointment"
                className="flex items-center gap-2 px-3 py-2 mt-4 bg-[#2B5C4B] text-white rounded-lg hover:bg-[#234539] transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-4 px-4 py-3 bg-[#2B5C4B]/5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#2B5C4B]">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{t.header.contact.address}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
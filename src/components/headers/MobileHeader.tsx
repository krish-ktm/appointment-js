import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gu' : 'en');
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed w-full z-50">
      <div className="relative bg-white shadow-sm px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
            >
              {t.header.clinicName}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${t.header.contact.phone}`}
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
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

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.home}
              </Link>
              <Link
                to="/about"
                className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                  isActive('/about') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.about}
              </Link>
              <Link
                to="/services"
                className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                  isActive('/services') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.services}
              </Link>
              <Link
                to="/gallery"
                className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                  isActive('/gallery') 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.gallery}
              </Link>
              
              {/* Appointment Buttons */}
              <div className="pt-2 space-y-2">
                <Link
                  to="/appointment"
                  className="block w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-center font-medium shadow-sm hover:shadow transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.navigation.appointment}
                </Link>
                
                <Link
                  to="/mr-appointment"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-center font-medium shadow-sm hover:shadow transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.navigation.mrAppointment}
                </Link>
              </div>
            </div>
            
            <div className="mt-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                {t.header.contact.address} • {t.header.contact.phone}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const handleBookNowClick = () => {
    const element = document.querySelector('.appointment-form-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#appointment-form';
    }
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'gu');
  };

  return (
    <header className="fixed w-full z-50 bg-white shadow-sm">
      <div className="relative px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
            >
              Shubham Skin & Laser
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="appearance-none bg-white px-2 py-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="gu">ગુજરાતી</option>
            </select>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
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
            className="bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.home}
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.about}
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.services}
              </Link>
              <Link
                to="/mr-appointment"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.navigation.mrAppointment}
              </Link>
              <button 
                onClick={handleBookNowClick}
                className="w-full mt-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                {t.common.bookAppointment}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

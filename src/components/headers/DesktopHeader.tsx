import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Clock, MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';

export function DesktopHeader() {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          controlNavbar();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gu' : 'en');
    setShowLanguageMenu(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="relative">
      {/* Top Bar */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ 
          y: isScrolled && scrollDirection === 'down' ? -100 : 0,
          opacity: isScrolled && scrollDirection === 'down' ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
        className="fixed w-full z-40 bg-white border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href={`tel:${t.header.contact.phone}`}
                className="flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Phone className="h-4 w-4 text-blue-500" />
                <span>{t.header.contact.phone}</span>
              </a>
              <div className="flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-gray-700">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{t.header.contact.hours.weekday}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-gray-700">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{t.header.contact.address}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.div 
        initial={{ y: 40 }}
        animate={{ 
          y: isScrolled ? 0 : 40,
          boxShadow: isScrolled ? '0 1px 3px 0 rgb(0 0 0 / 0.1)' : 'none',
        }}
        transition={{ duration: 0.3 }}
        className="fixed w-full z-50 bg-white/95 backdrop-blur-sm"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
              >
                {t.header.clinicName}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-8">
              <Link
                to="/"
                className={`relative py-2 transition-colors group ${
                  isActive('/') ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">{t.navigation.home}</span>
                <span className={`absolute bottom-1.5 left-0 w-full h-0.5 bg-blue-500 rounded-full transition-transform origin-left ${
                  isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
              <Link
                to="/about"
                className={`relative py-2 transition-colors group ${
                  isActive('/about') ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">{t.navigation.about}</span>
                <span className={`absolute bottom-1.5 left-0 w-full h-0.5 bg-blue-500 rounded-full transition-transform origin-left ${
                  isActive('/about') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
              <Link
                to="/services"
                className={`relative py-2 transition-colors group ${
                  isActive('/services') ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">{t.navigation.services}</span>
                <span className={`absolute bottom-1.5 left-0 w-full h-0.5 bg-blue-500 rounded-full transition-transform origin-left ${
                  isActive('/services') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
              <Link
                to="/mr-appointment"
                className={`relative py-2 transition-colors group ${
                  isActive('/mr-appointment') ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">{t.navigation.mrAppointment}</span>
                <span className={`absolute bottom-1.5 left-0 w-full h-0.5 bg-blue-500 rounded-full transition-transform origin-left ${
                  isActive('/mr-appointment') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span>{language === 'en' ? t.header.language.english : t.header.language.gujarati}</span>
                </button>

                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                    <button
                      onClick={toggleLanguage}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {language === 'en' ? t.header.language.gujarati : t.header.language.english}
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Clock, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';

export function DesktopHeader() {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);

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
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="relative w-full">
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
        <div className="w-full px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href={`tel:${t.header.contact.phone}`}
                className="flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Phone className="h-4 w-4 text-[#2B5C4B]" />
                <span>{t.header.contact.phone}</span>
              </a>
              <div className="flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-[#2B5C4B]">
                <Clock className="h-4 w-4 text-[#2B5C4B]" />
                <span>{t.header.contact.hours.weekday}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-gray-700">
                <MapPin className="h-4 w-4 text-[#2B5C4B]" />
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
        <div className="w-full px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="text-lg font-bold text-[#2B5C4B]"
              >
                {t.header.clinicName}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-8">
              {[
                { path: '/', label: t.navigation.home },
                { path: '/about', label: t.navigation.about },
                { path: '/services', label: t.navigation.services },
                { path: '/gallery', label: t.navigation.gallery },
                { path: '/appointment', label: t.navigation.appointment },
                { path: '/mr-appointment', label: t.navigation.mrAppointment }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative py-2 transition-colors group ${
                    isActive(item.path) ? 'text-[#2B5C4B]' : 'text-gray-600 hover:text-[#2B5C4B]'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className={`absolute bottom-1.5 left-0 w-full h-0.5 bg-[#2B5C4B] rounded-full transition-transform origin-left ${
                    isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </Link>
              ))}

              {/* Language Toggle */}
              <div className="relative">
                <button
                  onClick={toggleLanguage}
                  className="relative w-16 h-8 rounded-full bg-gradient-to-r from-[#2B5C4B]/10 to-[#2B5C4B]/5 p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 hover:from-[#2B5C4B]/15 hover:to-[#2B5C4B]/10 group"
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#2B5C4B] to-[#234539] shadow-lg shadow-[#2B5C4B]/10 transition-all duration-300 group-hover:shadow-[#2B5C4B]/20 ${
                      language === 'en' ? 'translate-x-8' : 'translate-x-0'
                    }`}
                  />
                  <div className="relative z-10 flex justify-between text-xs font-medium">
                    <span 
                      className={`pl-1.5 transition-colors duration-300 ${
                        language === 'gu' 
                          ? 'text-[#2B5C4B] font-semibold' 
                          : 'text-gray-500'
                      }`}
                    >
                      ગુ
                    </span>
                    <span 
                      className={`pr-1.5 transition-colors duration-300 ${
                        language === 'en' 
                          ? 'text-[#2B5C4B] font-semibold' 
                          : 'text-gray-500'
                      }`}
                    >
                      E
                    </span>
                  </div>
                </button>
              </div>

              <Link
                to="/appointment"
                className="inline-flex items-center whitespace-nowrap px-3 py-1.5 bg-[#2B5C4B] text-white text-sm rounded-lg hover:bg-[#234539] transition-colors"
              >
                <Calendar className="h-4 w-4 mr-1.5" />
                Book Now
              </Link>
            </nav>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Clock, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import { LanguageToggle } from './LanguageToggle';

export function DesktopHeader() {
  const { t } = useTranslation();
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
                className="flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors font-sans"
              >
                <Phone className="h-4 w-4 text-[#2B5C4B]" />
                <span>{t.header.contact.phone}</span>
              </a>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-[#2B5C4B] font-sans">
                <Clock className="h-4 w-4 text-[#2B5C4B] mt-1 sm:mt-0" />
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span>{t.header.contact.hours.weekday}</span>
                  <span className="sm:border-l sm:border-[#2B5C4B]/20 sm:pl-2">{t.header.contact.hours.saturday}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-gray-700 font-sans">
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
              <Link to="/" className="block">
                <img 
                  src="/shubham-logo.png" 
                  alt="Shubham Skin & Laser Clinic" 
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-8">
              {[
                { path: '/', label: t.navigation.home },
                { path: '/about', label: t.navigation.about },
                { path: '/services', label: t.navigation.services },
                { path: '/gallery', label: t.navigation.gallery },
                { path: '/contact', label: t.navigation.contact },
                { path: '/mr-appointment', label: t.navigation.mrAppointment }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative py-2 transition-colors group font-sans ${
                    isActive(item.path) ? 'text-[#2B5C4B]' : 'text-gray-600 hover:text-[#2B5C4B]'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className={`absolute bottom-1.5 left-0 w-full h-0.5 bg-[#2B5C4B] rounded-full transition-transform origin-left ${
                    isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </Link>
              ))}

              <LanguageToggle />

              <Link
                to="/appointment"
                className="inline-flex items-center whitespace-nowrap px-4 py-2 bg-[#2B5C4B] text-white text-sm rounded-xl hover:bg-[#234539] transition-colors font-sans"
              >
                <Calendar className="h-4 w-4 mr-1.5" />
                {t.header.bookNow}
              </Link>
            </nav>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
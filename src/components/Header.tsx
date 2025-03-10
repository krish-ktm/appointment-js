import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gradients, text, background } from '../theme/colors';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        className="fixed w-full z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="tel:+15551234567"
                className="flex items-center gap-2 text-xs sm:text-sm bg-gray-50/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                <span className="whitespace-nowrap">+1 (555) 123-4567</span>
              </a>
              <div className="hidden sm:flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-gray-700">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm bg-gray-50/80 px-3 py-1.5 rounded-full text-gray-700">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>123 Medical Center, Healthcare City</span>
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
                className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
              >
                Dr. Skin Care
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-8">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="relative py-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute bottom-1.5 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                </Link>
              ))}
              <button 
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow"
              >
                Book Now
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
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

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {['Home', 'About', 'Services', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <button 
                  className="w-full mt-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { gradients, text, background } from '../theme/colors';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="relative">
      {/* Top Bar */}
      <div className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-4 sm:gap-6">
              <motion.a
                href="tel:+15551234567"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-xs sm:text-sm bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-white/20 transition-colors text-gray-700"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                <span className="whitespace-nowrap">+1 (555) 123-4567</span>
              </motion.a>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="hidden sm:flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-gray-700"
              >
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-gray-700"
            >
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>123 Medical Center, Healthcare City</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div 
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
        style={{
          top: isScrolled ? 0 : 'auto',
          marginTop: !isScrolled ? '2.5rem' : 0
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 via-transparent to-blue-50/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${
                  isScrolled
                    ? 'bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900'
                    : 'text-gray-900'
                }`}
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
                  className={`relative group py-2 ${text.primary}`}
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full bg-blue-500"></span>
                </Link>
              ))}
              <button 
                className="px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
              >
                Book Now
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${text.primary} hover:bg-gray-100`}
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
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className={`block px-3 py-2 text-base font-medium ${text.primary} hover:bg-gray-50 rounded-lg transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <button className="w-full mt-2 px-3 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
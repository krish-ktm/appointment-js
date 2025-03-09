import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="absolute w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-6">
              <motion.a
                href="tel:+15551234567"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4 text-rose-400" />
                <span className="text-white/90">+1 (555) 123-4567</span>
              </motion.a>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="hidden sm:flex items-center gap-2 text-sm bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full"
              >
                <Clock className="h-4 w-4 text-emerald-400" />
                <span className="text-white/90">Mon - Sat: 9:00 AM - 7:00 PM</span>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full"
            >
              <MapPin className="h-4 w-4 text-sky-400" />
              <span className="text-white/90">123 Medical Center, Healthcare City</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div 
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/60 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.02)] supports-[backdrop-filter]:bg-white/50'
            : 'bg-gradient-to-b from-black/20 to-transparent pt-12'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-indigo-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className={`text-2xl font-bold transition-all duration-300 ${
                  isScrolled
                    ? 'bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600'
                    : 'text-white'
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
                  className={`relative group py-2 ${
                    isScrolled ? 'text-gray-800' : 'text-white'
                  }`}
                >
                  <span className="relative z-10">{item}</span>
                  <span className={`absolute inset-x-0 bottom-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600'
                      : 'bg-white'
                  }`}></span>
                </Link>
              ))}
              <button 
                className={`
                  px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105
                  ${isScrolled
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40'
                    : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                  }
                `}
              >
                Book Now
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled 
                    ? 'text-gray-800 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
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
            className="sm:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <button className="w-full mt-2 px-3 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:scale-[1.02]">
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
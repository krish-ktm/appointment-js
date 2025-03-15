import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBookNowClick = () => {
    const element = document.querySelector('.appointment-form-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#appointment-form';
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed w-full z-50 bg-white shadow-sm">
      {/* Contact Info Bar */}
      <div className="bg-gray-50 py-1 px-4 text-sm">
        <a href="tel:+917947131573" className="flex items-center justify-center gap-2 text-gray-600">
          <Phone className="h-3 w-3 text-blue-500" />
          <span>+91 79471 31573</span>
        </a>
      </div>

      {/* Main Header */}
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

          <div className="flex items-center">
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
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/mr-appointment"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                MR Appointment
              </Link>
              <button 
                onClick={handleBookNowClick}
                className="w-full mt-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Book Appointment
              </button>

              {/* Contact Information */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Mon - Fri: 9:00 AM - 6:30 PM</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>Mehsana Industrial Estate, Mehsana</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
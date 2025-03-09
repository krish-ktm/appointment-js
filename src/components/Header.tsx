import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm"
              >
                <Phone className="h-4 w-4 text-purple-200" />
                <span className="text-purple-100">+1 (555) 123-4567</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="hidden sm:flex items-center gap-2 text-sm"
              >
                <Clock className="h-4 w-4 text-purple-200" />
                <span className="text-purple-100">Mon - Sat: 9:00 AM - 7:00 PM</span>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm"
            >
              <MapPin className="h-4 w-4 text-purple-200" />
              <span className="text-purple-100">123 Medical Center, Healthcare City</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Dr. Skin Care
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-violet-600 transition-colors">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-violet-600 transition-colors">About</Link>
              <Link to="/services" className="text-gray-700 hover:text-violet-600 transition-colors">Services</Link>
              <Link to="/contact" className="text-gray-700 hover:text-violet-600 transition-colors">Contact</Link>
              <Link
                to="/book-appointment"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-600/20 transition-all duration-300"
              >
                Book Appointment
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-violet-600 transition-colors"
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
            className="sm:hidden bg-white border-t border-purple-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/book-appointment"
                className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
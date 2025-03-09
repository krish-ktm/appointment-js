import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
              Dr. Skin Care
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Expert dermatological care for all your skin health needs. We provide comprehensive
              skin treatments with the latest technology and personalized care.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Our Services" },
                { to: "/contact", label: "Contact Us" },
                { to: "/book-appointment", label: "Book Appointment" }
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-violet-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-violet-500"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 hover:text-violet-400 transition-colors duration-200">
                <div className="bg-violet-500/10 p-2 rounded-lg">
                  <Phone className="h-4 w-4 text-violet-400" />
                </div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-violet-400 transition-colors duration-200">
                <div className="bg-violet-500/10 p-2 rounded-lg">
                  <Mail className="h-4 w-4 text-violet-400" />
                </div>
                <span>contact@drskincare.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-violet-400 transition-colors duration-200">
                <div className="bg-violet-500/10 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-violet-400" />
                </div>
                <span>123 Medical Center, Healthcare City</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-violet-400 transition-colors duration-200">
                <div className="bg-violet-500/10 p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-violet-400" />
                </div>
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Follow Us</h3>
            <div className="flex gap-4">
              {[
                { icon: Facebook, color: "hover:bg-blue-600", href: "#" },
                { icon: Twitter, color: "hover:bg-blue-400", href: "#" },
                { icon: Instagram, color: "hover:bg-pink-600", href: "#" },
                { icon: Linkedin, color: "hover:bg-blue-700", href: "#" }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`bg-violet-500/10 p-3 rounded-xl ${social.color} hover:text-white transition-colors duration-300`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5 text-violet-400" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-800 mt-16 pt-8 text-center"
        >
          <p className="text-gray-400">
            © {new Date().getFullYear()} Dr. Skin Care. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
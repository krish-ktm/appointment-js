import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gu' : 'en');
  };

  return (
    <div className="relative">
      <motion.button
        onClick={toggleLanguage}
        whileTap={{ scale: 0.95 }}
        className="relative w-20 h-9 rounded-full bg-gray-100 p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 hover:bg-gray-200"
      >
        {/* Background Labels */}
        <div className="absolute inset-0 flex justify-between items-center px-2.5 pointer-events-none">
          <span className={`text-xs font-medium transition-colors duration-300 ${
            language === 'gu' ? 'text-[#2B5C4B] font-semibold' : 'text-gray-400'
          }`}>
            ગુ
          </span>
          <span className={`text-xs font-medium transition-colors duration-300 ${
            language === 'en' ? 'text-[#2B5C4B] font-semibold' : 'text-gray-400'
          }`}>
            En
          </span>
        </div>

        {/* Sliding Circle */}
        <motion.div
          animate={{
            x: language === 'en' ? 44 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-7 h-7 rounded-full bg-gradient-to-br from-[#2B5C4B] to-[#234539] shadow-md flex items-center justify-center"
        >
          <span className="text-[11px] font-semibold text-white">
            {language === 'en' ? 'En' : 'ગુ'}
          </span>
        </motion.div>
      </motion.button>
    </div>
  );
}
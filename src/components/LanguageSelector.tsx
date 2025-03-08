import { motion } from 'framer-motion';
import { Language } from '../types';

interface LanguageSelectorProps {
  onSelectLanguage: (lang: Language) => void;
}

export function LanguageSelector({ onSelectLanguage }: LanguageSelectorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 w-full max-w-md"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900"
        >
          Select Language / ભાષા પસંદ કરો
        </motion.h1>
        <div className="space-y-4">
          {[
            { lang: 'en' as Language, label: 'English' },
            { lang: 'gu' as Language, label: 'ગુજરાતી' }
          ].map((option, index) => (
            <motion.button
              key={option.lang}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => onSelectLanguage(option.lang)}
              className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 text-base sm:text-lg font-medium"
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
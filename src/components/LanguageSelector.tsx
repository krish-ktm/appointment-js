import { motion } from 'framer-motion';
import { Language } from '../types';

interface LanguageSelectorProps {
  onSelectLanguage: (lang: Language) => void;
}

export function LanguageSelector({ onSelectLanguage }: LanguageSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text"
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
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-lg font-medium"
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
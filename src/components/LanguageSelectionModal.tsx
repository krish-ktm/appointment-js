import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSelectionModal({ isOpen, onClose }: LanguageSelectionModalProps) {
  const { setLanguage } = useTranslation();

  const handleLanguageSelect = (lang: 'en' | 'gu') => {
    setLanguage(lang);
    localStorage.setItem('hasSelectedLanguage', 'true');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-xl font-semibold text-white">Select Your Language</h2>
              <p className="text-blue-100 mt-1">Choose your preferred language</p>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={() => handleLanguageSelect('en')}
                className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <span className="text-2xl">🇬🇧</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">English</h3>
                    <p className="text-sm text-gray-500">Continue in English</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleLanguageSelect('gu')}
                className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <span className="text-2xl">🇮🇳</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">ગુજરાતી</h3>
                    <p className="text-sm text-gray-500">ગુજરાતીમાં ચાલુ રાખો</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
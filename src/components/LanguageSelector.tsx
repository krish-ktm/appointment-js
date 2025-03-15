import { motion } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';
import { Language } from '../types';

export function LanguageSelector() {
  const { t, language, setLanguage } = useTranslation();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'gu', label: 'ગુજરાતી' }
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="appearance-none bg-white px-4 py-2 pr-8 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
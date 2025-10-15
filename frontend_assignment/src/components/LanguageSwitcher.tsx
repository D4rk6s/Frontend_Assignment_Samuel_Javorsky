'use client';

import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/appStore';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { theme } = useAppStore();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select 
      value={i18n.language} 
      onChange={(e) => changeLanguage(e.target.value)}
      className={`px-3 py-1 rounded-lg border transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <option value="sk">🇸🇰</option>
      <option value="cs">🇨🇿</option>
      <option value="en">en</option>
    </select>
  );
};

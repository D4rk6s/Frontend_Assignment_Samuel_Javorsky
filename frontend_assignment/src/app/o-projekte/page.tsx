'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { api, DonationStats } from '@/lib/api';
import { useAppStore } from '@/store/appStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function OProjektePage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useAppStore();
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      setError('Nepodarilo sa načítať štatistiky');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const storedLanguage = localStorage.getItem('i18nextLng');
    if (storedLanguage && storedLanguage !== i18n.language) {
      i18n.changeLanguage(storedLanguage);
    }
    fetchStats();
  }, []);
  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4 gap-4">
            <Link 
              href="/" 
              className="flex items-center text-[#4F46E5] hover:text-[#3B3B9A] transition-colors text-base sm:text-lg"
            >
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M14.6668 6H1.3335M1.3335 6L6.3335 11M1.3335 6L6.3335 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
                     {isMounted ? t('form.navigation.back') : 'Späť'}
            </Link>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageSwitcher />
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
                title={theme === 'light' ? t('theme.toggleDark') : t('theme.toggleLight')}
              >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700 dark:text-gray-300">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700 dark:text-gray-300">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              </button>
            </div>
          </div>
          
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 sm:mb-12 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isMounted ? t('pages.about.title') : 'O projekte'}
          </h1>
        </div>

        <div className="max-w-6xl">
          <div className="mb-8">
            <p className={`text-base sm:text-lg leading-relaxed mb-6 text-left transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('pages.about.description')}
            </p>
          </div>

          <div className={`border-t border-b py-12 mb-12 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="text-center">
                <div className="text-6xl font-bold text-[#4F46E5] mb-2">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-16 w-32 mx-auto rounded"></div>
                  ) : error ? (
                    <span className="text-red-500">Chyba</span>
                  ) : (
                    `${stats?.contribution?.toLocaleString('sk-SK') || '0'} €`
                  )}
                </div>
                <p className={`text-lg transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('pages.about.stats.totalRaised')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold text-[#4F46E5] mb-2">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-16 w-24 mx-auto rounded"></div>
                  ) : error ? (
                    <span className="text-red-500">Chyba</span>
                  ) : (
                    stats?.contributors?.toLocaleString('sk-SK') || '0'
                  )}
                </div>
                <p className={`text-lg transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('pages.about.stats.donorCount')}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <p className={`text-lg leading-relaxed text-left transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('pages.about.additionalInfo')}
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { GoodBoyIcon } from './GoodBoyIcon';
import { FacebookIcon, InstagramIcon } from './SocialIcons';
import { useAppStore } from '@/store/appStore';

export default function Footer() {
  const { t } = useTranslation();
  const { theme } = useAppStore();
  return (
    <div className="pt-1">
      <div className={`border-t pt-4 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
        <div className="px-4 sm:px-6 lg:px-12">
          <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center gap-2">
              <GoodBoyIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="font-bold text-base sm:text-lg">Good boy</span>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex space-x-2">
                <div className={`transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  <FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className={`transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="flex space-x-4 sm:space-x-6">
                <Link href="/kontakt" className={`transition-colors text-xs sm:text-sm ${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-700'}`}>{t('footer.contact')}</Link>
                <Link href="/o-projekte" className={`transition-colors text-xs sm:text-sm ${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-700'}`}>{t('footer.about')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

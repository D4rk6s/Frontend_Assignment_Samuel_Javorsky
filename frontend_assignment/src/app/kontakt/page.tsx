'use client';

import Footer from '@/components/Footer';
import Link from 'next/link';
import { useAppStore } from '@/store/appStore';

export default function KontaktPage() {
  const { theme, toggleTheme } = useAppStore();
  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <Link 
              href="/" 
              className="flex items-center text-[#4F46E5] hover:text-[#3B3B9A] transition-colors text-lg"
            >
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M14.6668 6H1.3335M1.3335 6L6.3335 11M1.3335 6L6.3335 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Späť
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
              title={theme === 'light' ? 'Prepnúť na tmavý režim' : 'Prepnúť na svetlý režim'}
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
          
          <h1 className={`text-4xl font-bold mb-12 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Kontakt
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#A5B4FC1A] rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#4F46E5]">
                <path d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Email</h3>
            <p className={`mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Our friendly team is here to help.</p>
            <a 
              href="mailto:hello@goodrequest.com" 
              className="text-[#4F46E5] hover:text-[#3B3B9A] transition-colors"
            >
              hello@goodrequest.com
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[#A5B4FC1A] rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#4F46E5]">
                <path d="M9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.34315 6 6 7.34315 6 9C6 10.6569 7.34315 12 9 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21C13 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 5 17 9 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Office</h3>
            <p className={`mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Come say hello at our office HQ.</p>
            <a 
              href="https://www.google.com/maps/search/Obchodná+3D,+010+08+Žilina,+Slovakia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4F46E5] hover:text-[#3B3B9A] transition-colors"
            >
              Obchodná 3D, 010 08 Žilina, Slovakia
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[#A5B4FC1A] rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#4F46E5]">
                <path d="M8.38028 8.85335C9.07627 10.303 10.0251 11.6616 11.2266 12.8632C12.4282 14.0648 13.7869 15.0136 15.2365 15.7096C15.3612 15.7694 15.4235 15.7994 15.5024 15.8224C15.7828 15.9041 16.127 15.8454 16.3644 15.6754C16.4313 15.6275 16.4884 15.5704 16.6027 15.4561C16.9523 15.1064 17.1271 14.9316 17.3029 14.8174C17.9658 14.3864 18.8204 14.3864 19.4833 14.8174C19.6591 14.9316 19.8339 15.1064 20.1835 15.4561L20.3783 15.6509C20.9098 16.1824 21.1755 16.4481 21.3198 16.7335C21.6069 17.301 21.6069 17.9713 21.3198 18.5389C21.1755 18.8242 20.9098 19.09 20.3783 19.6214L20.2207 19.779C19.6911 20.3087 19.4263 20.5735 19.0662 20.7757C18.6667 21.0001 18.0462 21.1615 17.588 21.1601C17.1751 21.1589 16.8928 21.0788 16.3284 20.9186C13.295 20.0576 10.4326 18.4332 8.04466 16.0452C5.65668 13.6572 4.03221 10.7948 3.17124 7.76144C3.01103 7.19699 2.93092 6.91477 2.9297 6.50182C2.92833 6.0436 3.08969 5.42311 3.31411 5.0236C3.51636 4.66357 3.78117 4.39876 4.3108 3.86913L4.46843 3.7115C4.99987 3.18006 5.2656 2.91433 5.55098 2.76999C6.11854 2.48292 6.7888 2.48292 7.35636 2.76999C7.64174 2.91433 7.90747 3.18006 8.43891 3.7115L8.63378 3.90637C8.98338 4.25597 9.15819 4.43078 9.27247 4.60655C9.70347 5.26945 9.70347 6.12403 9.27247 6.78692C9.15819 6.96269 8.98338 7.1375 8.63378 7.4871C8.51947 7.60142 8.46231 7.65857 8.41447 7.72538C8.24446 7.96281 8.18576 8.30707 8.26748 8.58743C8.29048 8.66632 8.32041 8.72866 8.38028 8.85335Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Phone</h3>
            <p className={`mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Mon-Fri from 8am to 5pm.</p>
            <a 
              href="tel:+421911750750" 
              className="text-[#4F46E5] hover:text-[#3B3B9A] transition-colors"
            >
              +421 911 750 750
            </a>
          </div>
        </div>

        <div className="mb-16 max-w-4xl mx-auto">
          <img 
            src="/a8a4a10d41ce21b94c2e255583fc2cf4de3f50bd.jpg" 
            alt="Golden Retriever on beach" 
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}

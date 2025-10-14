import Link from 'next/link';
import { GoodBoyIcon } from './GoodBoyIcon';
import { FacebookIcon, InstagramIcon } from './SocialIcons';

export default function Footer() {
  return (
    <div className="pt-1">
      <div className="border-t border-gray-300 pt-4">
        <div className="px-12">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <GoodBoyIcon className="w-10 h-10" />
              <span className="font-bold text-lg">Good boy</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-2">
                <div className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <div className="text-gray-400 hover:text-gray-600 transition-colors">
                  <InstagramIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex space-x-6">
                <Link href="/kontakt" className="hover:text-gray-700">Kontakt</Link>
                <Link href="/o-projekte" className="hover:text-gray-700">O projekte</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

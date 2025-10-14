import Link from 'next/link';
import { GoodBoyIcon } from './GoodBoyIcon';

export default function Footer() {
  return (
    <div className="pt-1">
      <div className="px-12">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <GoodBoyIcon className="w-10 h-10" />
              <span className="font-bold text-lg">Good boy</span>
            </div>
            <div className="flex gap-6">
              <Link href="/kontakt" className="hover:text-gray-700">Kontakt</Link>
              <Link href="/o-projekte" className="hover:text-gray-700">O projekte</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

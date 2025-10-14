'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { api, DonationStats } from '@/lib/api';

export default function OProjektePage() {
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        setError('Nepodarilo sa načítať štatistiky');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="flex items-center text-[#4F46E5] hover:text-[#3B3B9A] transition-colors mb-4 text-lg"
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M14.6668 6H1.3335M1.3335 6L6.3335 11M1.3335 6L6.3335 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Späť
          </Link>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-12">
            O projekte
          </h1>
        </div>

        <div className="max-w-6xl">
          <div className="mb-8">
            <p className="text-lg text-gray-900 leading-relaxed mb-6 text-left">
              Nadácia Good Boy sa venuje zlepšovaniu života psov v Žiline na Slovensku. 
              Zachraňujeme opustené, týrané a bezdomovské psy, poskytujeme im lekársku 
              starostlivosť, útočisko a lásku, ktorú si zaslúžia. Naším poslaním je dať 
              týmto verným spoločníkom druhú šancu na život tým, že im nájdeme milujúci domov. 
              Okrem záchrany a rehabilitácie sa zameriavame aj na podporu zodpovedného 
              vlastníctva zvierat a ochrany zvierat prostredníctvom vzdelávacích a 
              komunitných programov.
            </p>
          </div>

          <div className="border-t border-b border-gray-300 py-12 mb-12">
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
                <p className="text-lg text-gray-600">
                  Celková vyzbieraná hodnota
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
                <p className="text-lg text-gray-600">
                  Počet darcov
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <p className="text-lg text-gray-900 leading-relaxed text-left">
              Naša práca je možná vďaka podpore vášnivých dobrovoľníkov, štedrých darcov a 
              komunity, ktorá sa hlboko stará o dobro zvierat. Organizujeme aj kastračné a 
              sterilizačné iniciatívy, aby sme riešili problém túlavých psov a zabezpečili 
              dlhodobý vplyv. V nadácii Good Boy veríme, že každý pes si zaslúži bezpečný, 
              milujúci domov a šťastný život. Pridajte sa k nám a pomôžte nám robiť zmeny – 
              či už dobrovoľníctvom, darovaním alebo adopciou chlpatého priateľa. Spoločne 
              môžeme vytvoriť lepšiu budúcnosť pre psy v Žiline.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useShelters } from '@/hooks/useApi';
import { Select, NumberInput } from '@mantine/core';
import { GoodBoyIcon } from '@/components/GoodBoyIcon';
import { FacebookIcon, InstagramIcon } from '@/components/SocialIcons';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [donationType, setDonationType] = useState<'general' | 'shelter'>('general');
  const [selectedShelter, setSelectedShelter] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<number | undefined>(undefined);

  const { data: sheltersData } = useShelters();
  const shelters = sheltersData?.shelters || [];

  const predefinedAmounts = [5, 10, 20, 30, 50, 100];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount(undefined);
  };

  const handleCustomAmountChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setCustomAmount(numValue);
    setAmount(numValue);
  };

  return (
            <div className="min-h-screen bg-white">
              <div className="max-w-none mx-auto px-8 py-2">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 h-[95vh]">
                  
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div className="flex-1 p-12 flex flex-col justify-center">
              
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4F46E5' }}>
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <span className="ml-3 text-sm font-semibold text-gray-900">Výber útulku</span>
                  </div>
                  
                  <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center bg-white">
                      <span className="text-gray-400 text-sm">2</span>
                    </div>
                    <span className="ml-3 text-sm text-gray-400">Osobné údaje</span>
                  </div>
                  
                  <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center bg-white">
                      <span className="text-gray-400 text-sm">3</span>
                    </div>
                    <span className="ml-3 text-sm text-gray-400">Potvrdenie</span>
                  </div>
                </div>
              </div>

                      <h1 className="text-gray-900 mb-10" style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '48px',
                        lineHeight: '56px',
                        letterSpacing: '-0.3px'
                      }}>
                        Vyberte si možnosť, ako chcete pomôcť
                      </h1>

                      <div className="mb-10">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setDonationType('shelter')}
                            className={`flex-1 py-4 px-6 rounded-xl border-2 transition-colors ${
                              donationType === 'shelter'
                                ? 'text-white border-[#4F46E5]'
                                : 'text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ 
                              backgroundColor: donationType === 'shelter' ? '#4F46E5' : undefined,
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '0px',
                              textAlign: 'center'
                            }}
                          >
                            Prispieť konkrétnemu útulku
                          </button>
                          <button
                            onClick={() => setDonationType('general')}
                            className={`flex-1 py-4 px-6 rounded-xl border-2 transition-colors ${
                              donationType === 'general'
                                ? 'text-white border-[#4F46E5]'
                                : 'text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ 
                              backgroundColor: donationType === 'general' ? '#4F46E5' : undefined,
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '0px',
                              textAlign: 'center'
                            }}
                          >
                            Prispieť celej nadácii
                          </button>
                        </div>
                      </div>

                      <div className="mb-10">
                        <h3 className="text-gray-900 mb-4" style={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '16px',
                          lineHeight: '24px',
                          letterSpacing: '0px'
                        }}>O projekte</h3>
                        <label className="text-gray-900 mb-1 block" style={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0px',
                        }}>
                          Útulok {donationType === 'general' && <span className="text-gray-500 font-normal">(Nepovinné)</span>}
                        </label>
                        <Select
                          placeholder="Vyberte útulok zo zoznamu"
                          data={shelters.map(shelter => ({ value: shelter.id.toString(), label: shelter.name }))}
                          value={selectedShelter}
                          onChange={setSelectedShelter}
                          className="w-full"
                          size="lg"
                          styles={{
                            input: {
                              backgroundColor: donationType === 'general' ? '#f3f4f6' : 'white',
                              borderColor: donationType === 'general' ? '#9ca3af' : undefined,
                            }
                          }}
                          rightSection={
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          }
                        />
                      </div>

                      <div className="mb-10">
                        <h3 className="text-gray-900 mb-8" style={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '16px',
                          lineHeight: '24px',
                          letterSpacing: '0px'
                        }}>
                          Suma, ktorou chcem prispieť
                        </h3>
                        
                        <div className="mb-8">
                          <div className="flex items-center justify-center text-5xl font-bold text-gray-900 pb-3">
                            <div className="border-b-2 border-[#4F46E5] px-2 pb-1">
                              <input
                                type="number"
                                value={customAmount || amount}
                                onChange={(e) => handleCustomAmountChange(e.target.value)}
                                className={`bg-transparent border-none outline-none text-5xl font-bold w-32 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${(customAmount || amount) === 0 ? 'text-gray-400' : 'text-gray-900'}`}
                                placeholder="0"
                                min="1"
                              />
                              <span className="ml-2 text-3xl">€</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                          {predefinedAmounts.map((predefinedAmount) => (
                            <button
                              key={predefinedAmount}
                              onClick={() => handleAmountSelect(predefinedAmount)}
                              className={`py-3 px-5 rounded-lg border-2 transition-colors font-semibold text-xl ${
                                amount === predefinedAmount && !customAmount
                                  ? 'text-white border-[#4F46E5]'
                                  : 'text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: amount === predefinedAmount && !customAmount ? '#4F46E5' : undefined }}
                            >
                              {predefinedAmount} €
                            </button>
                          ))}
                        </div>
        </div>

                      <div className="flex justify-between items-center -mb-4">
                        <button
                          onClick={handlePrevious}
                          disabled={currentStep === 1}
                          className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '0px'
                          }}
                        >
                          ← Späť
                        </button>
                        
                        <button
                          onClick={handleNext}
                          className="flex items-center px-8 py-3 text-white rounded-lg hover:opacity-90"
                          style={{ 
                            backgroundColor: '#4F46E5',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '0px'
                          }}
                        >
                          Pokračovať →
                        </button>
                      </div>

            </div>
            
                    <div className="mt-2 pt-2">
                      <div className="px-12">
                        <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                        <div className="flex items-center text-2xl text-gray-900">
                          <GoodBoyIcon className="w-8 h-8" />
                          <span className="ml-2 font-bold">Good boy</span>
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
                          <div className="flex space-x-6 text-base text-gray-500">
                            <a href="/contact" className="hover:text-gray-700">Kontakt</a>
                            <a href="/about" className="hover:text-gray-700">O projekte</a>
                          </div>
                        </div>
                        </div>
                        </div>
                      </div>
                    </div>
          </div>

                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[95vh]">
                      <img 
                        src="/db75a6e8c00ae495475b9cf39f6d9ec06e7e4dba.jpg" 
                        alt="Dog" 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
        </div>
      </div>
    </div>
  );
}
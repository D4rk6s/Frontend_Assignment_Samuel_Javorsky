'use client';

import { useState } from 'react';
import { useShelters } from '@/hooks/useApi';
import { Select, NumberInput, TextInput, Checkbox } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { GoodBoyIcon } from '@/components/GoodBoyIcon';
import { FacebookIcon, InstagramIcon } from '@/components/SocialIcons';
import Footer from '@/components/Footer';
import { donationFormSchema } from '@/lib/validation';
import Link from 'next/link';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [donationType, setDonationType] = useState<'general' | 'shelter'>('general');
  const [selectedShelter, setSelectedShelter] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<number | undefined>(undefined);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+421');
  const [consent, setConsent] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { data: sheltersData } = useShelters();
  const shelters = sheltersData?.shelters || [];

  const predefinedAmounts = [5, 10, 20, 30, 50, 100];

  const validateField = (fieldName: string, value: any) => {
    const newErrors = { ...errors };
    delete newErrors[fieldName];
    
    const fieldSchema = donationFormSchema.shape[fieldName as keyof typeof donationFormSchema.shape];
    if (fieldSchema) {
      const result = fieldSchema.safeParse(value);
      if (!result.success) {
        newErrors[fieldName] = result.error.issues[0].message;
      }
    }
    
    setErrors(newErrors);
  };

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      const currentAmount = customAmount || amount;
      if (currentAmount === 0) {
        newErrors.amount = 'Prosím vyberte sumu príspevku';
      }
      if (donationType === 'shelter' && !selectedShelter) {
        newErrors.shelter = 'Prosím vyberte útulok';
      }
    }
    
    if (step === 2) {
      const formData = {
        donationType,
        shelterId: selectedShelter ? parseInt(selectedShelter) : undefined,
        amount: customAmount || amount,
        customAmount,
        firstName: firstName || '',
        lastName,
        email,
        phone,
        countryCode,
        gdprConsent: true
      };

      try {
        donationFormSchema.parse(formData);
      } catch (error: any) {
        if (error.issues) {
          error.issues.forEach((err: any) => {
            if (err.path[0] !== 'gdprConsent') {
              newErrors[err.path[0]] = err.message;
            }
          });
        }
      }
    }
    
    if (step === 3) {
      if (!consent) {
        newErrors.gdprConsent = 'Musíte súhlasiť so spracovaním osobných údajov';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep(1)) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep(2)) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (validateStep(3)) {
        const formData = {
          contributors: [
            {
              firstName: firstName.trim() === '' ? 'Anonymous' : firstName,
              lastName: lastName,
              email: email,
              phone: phone ? `${countryCode} ${phone}` : null
            }
          ],
          shelterID: donationType === 'shelter' && selectedShelter ? parseInt(selectedShelter) : null,
          value: customAmount || amount
        };
        
        notifications.show({
          title: 'Príspevok bol úspešne odoslaný!',
          message: 'Ďakujeme za vašu podporu.',
          color: 'green',
          icon: '✅',
          autoClose: 5000,
        });
      }
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
    const newErrors = { ...errors };
    delete newErrors.amount;
    setErrors(newErrors);
  };

  const handleCustomAmountChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setCustomAmount(numValue);
    setAmount(numValue);
    if (numValue > 0) {
      const newErrors = { ...errors };
      delete newErrors.amount;
      setErrors(newErrors);
    }
  };

  return (
            <div className="min-h-screen bg-white">
              <div className="max-w-none mx-auto px-8 py-2">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 h-[95vh]">
                  
                  <div className="lg:col-span-3 flex flex-col h-[95vh]">
                    <div className="p-12 h-full flex flex-col">
              
              <div className="h-20 flex items-center mb-8">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep > 1 ? 'border-2 border-[#4F46E5] bg-white' : currentStep === 1 ? 'bg-[#4F46E5]' : 'bg-gray-300'
                    }`}>
                      <span className={`text-sm font-bold ${
                        currentStep > 1 ? 'text-[#4F46E5]' : currentStep === 1 ? 'text-white' : 'text-gray-500'
                      }`}>
                        {currentStep > 1 ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : '1'}
                      </span>
                    </div>
                    <span className={`ml-3 text-sm font-semibold ${
                      currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'
                    }`}>Výber útulku</span>
                  </div>
                  
                  <div className="flex-1 h-px mx-4 bg-[#D1D5DB]"></div>
                  
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep > 2 ? 'border-2 border-[#4F46E5] bg-white' : currentStep === 2 ? 'bg-[#4F46E5]' : 'bg-gray-300'
                    }`}>
                      <span className={`text-sm font-bold ${
                        currentStep > 2 ? 'text-[#4F46E5]' : currentStep === 2 ? 'text-white' : 'text-gray-500'
                      }`}>
                        {currentStep > 2 ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : '2'}
                      </span>
                    </div>
                    <span className={`ml-3 text-sm font-semibold ${
                      currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'
                    }`}>Osobné údaje</span>
                  </div>
                  
                  <div className="flex-1 h-px mx-4 bg-[#D1D5DB]"></div>
                  
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 3 ? 'bg-[#4F46E5]' : 'bg-gray-300'
                    }`}>
                      <span className={`text-sm font-bold ${
                        currentStep === 3 ? 'text-white' : 'text-gray-500'
                      }`}>3</span>
                    </div>
                    <span className={`ml-3 text-sm font-semibold ${
                      currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'
                    }`}>Potvrdenie</span>
                  </div>
                </div>
              </div>

                      <div className="h-16 flex items-center mb-6">
                        {currentStep === 1 && (
                          <h1 className="text-gray-900" style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '48px',
                            lineHeight: '56px',
                            letterSpacing: '-0.3px'
                          }}>
                            Vyberte si možnosť, ako chcete pomôcť
                          </h1>
                        )}

                        {currentStep === 2 && (
                          <h1 className="text-gray-900" style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '48px',
                            lineHeight: '56px',
                            letterSpacing: '-0.3px'
                          }}>
                            Potrebujeme od Vás zopár informácií
                          </h1>
                        )}

                        {currentStep === 3 && (
                          <h1 className="text-gray-900" style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '48px',
                            lineHeight: '56px',
                            letterSpacing: '-0.3px'
                          }}>
                            Skontrolujte si zadané údaje
                          </h1>
                        )}
                      </div>

                      <div className="flex-1">

                      {currentStep === 1 && (
                        <div className="mb-6 mt-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setDonationType('shelter');
                              }}
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
                              onClick={() => {
                                setDonationType('general');
                                setSelectedShelter(null);
                                const newErrors = { ...errors };
                                delete newErrors.shelter;
                                setErrors(newErrors);
                              }}
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
                      )}

                      {currentStep === 1 && (
                        <div className="mb-6">
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
                            size="md"
                            error={errors.shelter}
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
                      )}

                      {currentStep === 1 && (
                        <div className="mb-6">
                          <h3 className="text-gray-900 mb-6" style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '0px'
                          }}>
                            Suma, ktorou chcem prispieť
                          </h3>
                          
                          <div className="mb-6">
                            <div className="flex items-center justify-center text-4xl font-bold text-gray-900 pb-2">
                              <div className="border-b-2 border-[#4F46E5] px-2 pb-1">
                                <input
                                  type="number"
                                  value={customAmount || amount}
                                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                                  className={`bg-transparent border-none outline-none text-4xl font-bold w-28 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${(customAmount || amount) === 0 ? 'text-gray-400' : 'text-gray-900'}`}
                                  placeholder="0"
                                  min="1"
                                />
                                <span className="ml-2 text-2xl">€</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-6 gap-2">
                            {predefinedAmounts.map((predefinedAmount) => (
                              <button
                                key={predefinedAmount}
                                onClick={() => handleAmountSelect(predefinedAmount)}
                                className={`py-1.5 px-1 rounded-lg border-2 transition-colors font-semibold text-sm ${
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
                          {errors.amount && (
                            <p className="text-red-500 text-sm mt-2">{errors.amount}</p>
                          )}
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="mb-6">
                          <div className="mb-6">
                            <h3 className="text-gray-900 mb-4" style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 600,
                              fontSize: '16px',
                              lineHeight: '24px',
                              letterSpacing: '0px'
                            }}>O vás</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-gray-900 mb-1 block" style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  lineHeight: '20px',
                                  letterSpacing: '0px',
                                }}>Meno</label>
                                <TextInput
                                  placeholder="Zadajte Vaše meno"
                                  value={firstName}
                                  onChange={(e) => {
                                    setFirstName(e.target.value);
                                    validateField('firstName', e.target.value);
                                  }}
                                  size="lg"
                                  error={errors.firstName}
                                  styles={{
                                    input: { backgroundColor: '#f3f4f6' }
                                  }}
                                />
                              </div>
                              <div>
                                <label className="text-gray-900 mb-1 block" style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  lineHeight: '20px',
                                  letterSpacing: '0px',
                                }}>Priezvisko</label>
                                <TextInput
                                  placeholder="Zadajte Vaše priezvisko"
                                  value={lastName}
                                  onChange={(e) => {
                                    setLastName(e.target.value);
                                    validateField('lastName', e.target.value);
                                  }}
                                  size="lg"
                                  error={errors.lastName}
                                  styles={{
                                    input: { backgroundColor: '#f3f4f6' }
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <label className="text-gray-900 mb-1 block" style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '0px',
                            }}>E-mailová adresa</label>
                            <TextInput
                              placeholder="Zadajte Váš e-mail"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                validateField('email', e.target.value);
                              }}
                              size="lg"
                              error={errors.email}
                              styles={{
                                input: { backgroundColor: '#f3f4f6' }
                              }}
                            />
                          </div>

                          <div className="mb-6">
                            <label className="text-gray-900 mb-1 block" style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '0px',
                            }}>Telefónne číslo</label>
                            <div className="flex">
                              <Select
                                data={[
                                  { value: '+421', label: '+421' },
                                  { value: '+420', label: '+420' }
                                ]}
                                renderOption={({ option }) => (
                                  <div className="flex items-center">
                                    {option.value === '+421' ? (
                                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <path d="M10 19.9997C15.5228 19.9997 20 15.5225 20 9.9997C20 8.77649 19.78 7.60474 19.378 6.52145H0.621992C0.220039 7.60474 0 8.77649 0 9.9997C0 15.5225 4.47719 19.9997 10 19.9997Z" fill="#0052B4"/>
                                        <path d="M10.0001 19.9997C14.2997 19.9997 17.9652 17.2859 19.3781 13.4779H0.62207C2.035 17.2859 5.70043 19.9997 10.0001 19.9997Z" fill="#D80027"/>
                                        <path d="M2.58545 5.65158V10.6401C2.58545 13.4778 6.29252 14.3472 6.29252 14.3472C6.29252 14.3472 9.99955 13.4778 9.99955 10.6401V5.65158H2.58545Z" fill="#F0F0F0"/>
                                        <path d="M3.45532 5.65158V10.6401C3.45532 10.9732 3.52931 11.2878 3.67587 11.5828C5.13032 11.5828 7.30423 11.5828 8.90974 11.5828C9.0563 11.2879 9.13028 10.9732 9.13028 10.6401V5.65158H3.45532Z" fill="#D80027"/>
                                        <path d="M8.0322 9.13013H6.7279V8.26055H7.59747V7.39098H6.7279V6.52145H5.85833V7.39098H4.9888V8.26055H5.85833V9.13013H4.55396V9.9997H5.85833V10.8693H6.7279V9.9997H8.0322V9.13013Z" fill="#F0F0F0"/>
                                        <path d="M4.86184 12.7977C5.42219 13.1499 5.99789 13.3543 6.29262 13.4453C6.58734 13.3544 7.16305 13.1499 7.7234 12.7977C8.28848 12.4426 8.68461 12.0364 8.90953 11.5839C8.66145 11.4084 8.35875 11.3048 8.03176 11.3048C7.9127 11.3048 7.79703 11.3189 7.68582 11.3448C7.45016 10.8094 6.9152 10.4353 6.29266 10.4353C5.67012 10.4353 5.13512 10.8094 4.89949 11.3448C4.78828 11.3189 4.67258 11.3048 4.55355 11.3048C4.22656 11.3048 3.92387 11.4084 3.67578 11.5839C3.90059 12.0364 4.29672 12.4425 4.86184 12.7977Z" fill="#0052B4"/>
                                      </svg>
                                    ) : (
                                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <mask id="circle-mask-cz" x="0" y="0" width="20" height="20" maskUnits="userSpaceOnUse">
                                          <circle cx="10" cy="10" r="10" fill="white" />
                                        </mask>
                                        <g mask="url(#circle-mask-cz)">
                                          <rect width="20" height="10" y="0" fill="#F0F0F0"/>
                                          <rect width="20" height="10" y="10" fill="#D80027"/>
                                          <path d="M0 0L10 10L0 20V0Z" fill="#0052B4"/>
                                        </g>
                                      </svg>
                                    )}
                                    <span>{option.label}</span>
                                  </div>
                                )}
                                value={countryCode}
                                onChange={(value) => setCountryCode(value || '+421')}
                                size="lg"
                                className="w-24"
                                leftSection={
                                  <div className="flex justify-center w-full">
                                    {countryCode === '+421' ? (
                                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 19.9997C15.5228 19.9997 20 15.5225 20 9.9997C20 8.77649 19.78 7.60474 19.378 6.52145H0.621992C0.220039 7.60474 0 8.77649 0 9.9997C0 15.5225 4.47719 19.9997 10 19.9997Z" fill="#0052B4"/>
                                        <path d="M10.0001 19.9997C14.2997 19.9997 17.9652 17.2859 19.3781 13.4779H0.62207C2.035 17.2859 5.70043 19.9997 10.0001 19.9997Z" fill="#D80027"/>
                                        <path d="M2.58545 5.65158V10.6401C2.58545 13.4778 6.29252 14.3472 6.29252 14.3472C6.29252 14.3472 9.99955 13.4778 9.99955 10.6401V5.65158H2.58545Z" fill="#F0F0F0"/>
                                        <path d="M3.45532 5.65158V10.6401C3.45532 10.9732 3.52931 11.2878 3.67587 11.5828C5.13032 11.5828 7.30423 11.5828 8.90974 11.5828C9.0563 11.2879 9.13028 10.9732 9.13028 10.6401V5.65158H3.45532Z" fill="#D80027"/>
                                        <path d="M8.0322 9.13013H6.7279V8.26055H7.59747V7.39098H6.7279V6.52145H5.85833V7.39098H4.9888V8.26055H5.85833V9.13013H4.55396V9.9997H5.85833V10.8693H6.7279V9.9997H8.0322V9.13013Z" fill="#F0F0F0"/>
                                        <path d="M4.86184 12.7977C5.42219 13.1499 5.99789 13.3543 6.29262 13.4453C6.58734 13.3544 7.16305 13.1499 7.7234 12.7977C8.28848 12.4426 8.68461 12.0364 8.90953 11.5839C8.66145 11.4084 8.35875 11.3048 8.03176 11.3048C7.9127 11.3048 7.79703 11.3189 7.68582 11.3448C7.45016 10.8094 6.9152 10.4353 6.29266 10.4353C5.67012 10.4353 5.13512 10.8094 4.89949 11.3448C4.78828 11.3189 4.67258 11.3048 4.55355 11.3048C4.22656 11.3048 3.92387 11.4084 3.67578 11.5839C3.90059 12.0364 4.29672 12.4425 4.86184 12.7977Z" fill="#0052B4"/>
                                      </svg>
                                    ) : (
                                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <mask id="circle-mask-cz" x="0" y="0" width="20" height="20" maskUnits="userSpaceOnUse">
                                          <circle cx="10" cy="10" r="10" fill="white" />
                                        </mask>
                                        <g mask="url(#circle-mask-cz)">
                                          <rect width="20" height="10" y="0" fill="#F0F0F0"/>
                                          <rect width="20" height="10" y="10" fill="#D80027"/>
                                          <path d="M0 0L10 10L0 20V0Z" fill="#0052B4"/>
                                        </g>
                                      </svg>
                                    )}
                                  </div>
                                }
                                rightSection={
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                }
                                styles={{
                                  input: { 
                                    borderTopRightRadius: 0, 
                                    borderBottomRightRadius: 0, 
                                    borderRight: 0,
                                    backgroundColor: '#f3f4f6'
                                  }
                                }}
                              />
                              <TextInput
                                placeholder="123 321 123"
                                value={`${countryCode} ${phone}`}
                                onChange={(e) => {
                                  const fullValue = e.target.value;
                                  const withoutCountryCode = fullValue.replace(countryCode, '').trim();
                                  const numbersOnly = withoutCountryCode.replace(/[^0-9\s]/g, '');
                                  setPhone(numbersOnly);
                                  validateField('phone', numbersOnly);
                                }}
                                size="lg"
                                className="flex-1"
                                error={errors.phone}
                                styles={{
                                  input: { 
                                    borderTopLeftRadius: 0, 
                                    borderBottomLeftRadius: 0,
                                    backgroundColor: '#f3f4f6'
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-8">
                          <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Zhrnutie</h3>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Forma pomoci</span>
                                <span className="font-medium text-gray-900">
                                  {donationType === 'general' 
                                    ? 'Finančný príspevok celej nadácii' 
                                    : 'Finančný príspevok konkrétnemu útulku'
                                  }
                                </span>
                              </div>
                              {donationType === 'shelter' && selectedShelter && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Útulok</span>
                                  <span className="font-medium text-gray-900">{selectedShelter}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Suma príspevku</span>
                                <span className="font-medium text-gray-900">
                                  {customAmount ? `${customAmount} €` : `${amount} €`}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Meno a priezvisko</span>
                                <span className="font-medium text-gray-900">{firstName} {lastName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">E-mail</span>
                                <span className="font-medium text-gray-900">{email}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Telefónne číslo</span>
                                <span className="font-medium text-gray-900">{countryCode} {phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <Checkbox
                              checked={consent}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setConsent(event.currentTarget.checked);
                                validateField('gdprConsent', event.currentTarget.checked);
                              }}
                              label="Súhlasím so spracovaním mojich osobných údajov"
                              size="md"
                              error={errors.gdprConsent}
                              styles={{
                                label: {
                                  fontSize: '14px',
                                  lineHeight: '20px',
                                  color: '#374151'
                                },
                                input: {
                                  backgroundColor: consent ? '#f3f4f6' : 'white',
                                  borderColor: '#4F46E5',
                                  '&:checked': {
                                    backgroundColor: '#f3f4f6',
                                    borderColor: '#4F46E5'
                                  }
                                },
                                icon: {
                                  color: '#4F46E5'
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                      </div>

                      <div className="h-12 flex justify-between items-center mt-2">
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
                          {currentStep === 3 ? 'Odoslať formulár' : 'Pokračovať →'}
                        </button>
                      </div>

                    </div>
            
                    <Footer />
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
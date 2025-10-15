'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { useShelters } from '@/hooks/useApi';
import { Select, TextInput, Checkbox } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { donationFormSchema, DonationFormData } from '@/lib/validation';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/appStore';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { currentStep, nextStep, previousStep, setSubmitting, isSubmitting, theme, toggleTheme } = useAppStore();
  const [isMounted, setIsMounted] = useState(false);
  
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedLanguage = localStorage.getItem('i18nextLng');
    if (storedLanguage && storedLanguage !== i18n.language) {
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    if (currentStep === 1 && amountRef.current) {
      amountRef.current.focus();
    } else if (currentStep === 2) {
      const firstNameField = document.querySelector('input[placeholder*="meno"], input[placeholder*="first name"], input[placeholder*="jméno"]') as HTMLInputElement;
      if (firstNameField) {
        firstNameField.focus();
      }
    }
  }, [currentStep]);
  
  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      donationType: 'general',
      shelterId: undefined,
      amount: 0,
      customAmount: undefined,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '+421',
      gdprConsent: false,
    },
    mode: 'onChange',
  });

  const { watch, setValue, register, formState: { errors } } = form;
  
  const donationType = watch('donationType');
  const selectedShelter = watch('shelterId');
  const amount = watch('amount');
  const customAmount = watch('customAmount');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const email = watch('email');
  const phone = watch('phone');
  const countryCode = watch('countryCode');
  const consent = watch('gdprConsent');

  const { data: sheltersData } = useShelters();
  const shelters = sheltersData?.shelters || [];

  const predefinedAmounts = [5, 10, 20, 30, 50, 100];

  const handleKeyDown = (e: React.KeyboardEvent, nextFieldSelector: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.querySelector(nextFieldSelector) as HTMLInputElement;
      if (nextField) {
        nextField.focus();
      }
    }
  };

  const validateStep = async (step: number) => {
    if (step === 1) {
      const fieldsToValidate = ['amount', 'donationType', 'shelterId'];
      const results = await Promise.all(
        fieldsToValidate.map(field => form.trigger(field as keyof DonationFormData))
      );
      return results.every(result => result);
    }
    
    if (step === 2) {
      const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'countryCode'];
      const results = await Promise.all(
        fieldsToValidate.map(field => form.trigger(field as keyof DonationFormData))
      );
      return results.every(result => result);
    }
    
    if (step === 3) {
      return await form.trigger('gdprConsent');
    }
    
    return true;
  };

  const onSubmit = async (data: DonationFormData) => {
    setSubmitting(true);
    
    const formData = {
      contributors: [
        {
          firstName: data.firstName.trim() === '' ? 'Anonymous' : data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone ? `${data.countryCode} ${data.phone}` : undefined
        }
      ],
      shelterID: data.donationType === 'shelter' && data.shelterId ? data.shelterId : undefined,
      value: data.customAmount || data.amount
    };
    
    try {
      await api.submitDonation(formData);
      notifications.show({
        title: t('form.notifications.success.title'),
        message: t('form.notifications.success.message'),
        color: 'green',
        icon: '✅',
        autoClose: 5000,
      });
    } catch {
      notifications.show({
        title: t('form.notifications.error.title'),
        message: t('form.notifications.error.message'),
        color: 'red',
        icon: '❌',
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (await validateStep(1)) {
        nextStep();
      }
    } else if (currentStep === 2) {
      if (await validateStep(2)) {
        nextStep();
      }
    } else if (currentStep === 3) {
      if (await validateStep(3)) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setValue('amount', selectedAmount, { shouldValidate: true });
    setValue('customAmount', undefined, { shouldValidate: true });
  };

  const handleCustomAmountChange = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setValue('customAmount', numValue, { shouldValidate: true });
    setValue('amount', numValue, { shouldValidate: true });
  };

  return (
            <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12">
                  
                  <div className="lg:col-span-3 flex flex-col relative">
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 z-10">
                      <LanguageSwitcher />
                      <button
                        onClick={toggleTheme}
                        className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
                        title={theme === 'light' ? t('theme.toggleDark') : t('theme.toggleLight')}
                      >
                      {theme === 'light' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700 dark:text-gray-300 sm:w-5 sm:h-5">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700 dark:text-gray-300 sm:w-5 sm:h-5">
                          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                      </button>
                    </div>
                    <div className="p-4 sm:p-6 lg:p-12 flex flex-col h-full">
                      <div className="h-16 sm:h-20 flex items-center mb-6 sm:mb-8">
                        <div className="flex items-center w-full">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                              currentStep > 1 ? 'border-2 border-[#4F46E5] bg-white' : currentStep === 1 ? 'bg-[#4F46E5]' : 'bg-white border-2 border-[#D1D5DB]'
                            }`}>
                              <span className={`text-xs sm:text-sm font-bold ${
                                currentStep > 1 ? 'text-[#4F46E5]' : currentStep === 1 ? 'text-white' : 'text-[#D1D5DB]'
                              }`}>
                                {currentStep > 1 ? (
                                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-3 sm:h-3">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : '1'}
                              </span>
                            </div>
                            <span className={`ml-2 sm:ml-3 text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                              currentStep >= 1 ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-[#D1D5DB]'
                            }`}>{isMounted ? t('form.step1.shelterLabel') : 'Výber útulku'}</span>
                          </div>
                          
                          <div className="flex-1 h-px mx-2 sm:mx-4 bg-[#D1D5DB]"></div>
                          
                          <div className="flex items-center">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                              currentStep > 2 ? 'border-2 border-[#4F46E5] bg-white' : currentStep === 2 ? 'bg-[#4F46E5]' : 'bg-white border-2 border-[#D1D5DB]'
                            }`}>
                              <span className={`text-xs sm:text-sm font-bold ${
                                currentStep > 2 ? 'text-[#4F46E5]' : currentStep === 2 ? 'text-white' : 'text-[#D1D5DB]'
                              }`}>
                                {currentStep > 2 ? (
                                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-3 sm:h-3">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : '2'}
                              </span>
                            </div>
                            <span className={`ml-2 sm:ml-3 text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                              currentStep >= 2 ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-[#D1D5DB]'
                            }`}>{isMounted ? t('form.step2.aboutYou') : 'Osobné údaje'}</span>
                          </div>
                          
                          <div className="flex-1 h-px mx-2 sm:mx-4 bg-[#D1D5DB]"></div>
                          
                          <div className="flex items-center">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                              currentStep === 3 ? 'bg-[#4F46E5]' : 'bg-white border-2 border-[#D1D5DB]'
                            }`}>
                              <span className={`text-xs sm:text-sm font-bold ${
                                currentStep === 3 ? 'text-white' : 'text-[#D1D5DB]'
                              }`}>3</span>
                            </div>
                            <span className={`ml-2 sm:ml-3 text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                              currentStep >= 3 ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-[#D1D5DB]'
                            }`}>{isMounted ? t('form.step3.title') : 'Potvrdenie'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-12 sm:h-16 lg:h-20 flex items-center mb-4 sm:mb-6 lg:mb-8">
                        {currentStep === 1 && (
                          <h1 className={`transition-colors duration-300 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {t('form.step1.title')}
                          </h1>
                        )}

                        {currentStep === 2 && (
                          <h1 className={`transition-colors duration-300 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {t('form.step2.title')}
                          </h1>
                        )}

                        {currentStep === 3 && (
                          <h1 className={`transition-colors duration-300 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {t('form.step3.title')}
                          </h1>
                        )}
                      </div>

                      <div className="flex-1">
                        {currentStep === 1 && (
                          <div className="mb-6 mt-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setValue('donationType', 'shelter', { shouldValidate: true });
                              }}
                              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 transition-colors text-sm sm:text-base font-medium text-center ${
                                donationType === 'shelter'
                                  ? 'text-white border-[#4F46E5]'
                                  : theme === 'dark' 
                                    ? 'text-white border-gray-600 hover:border-gray-500' 
                                    : 'text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ 
                                backgroundColor: donationType === 'shelter' ? '#4F46E5' : undefined
                              }}
                            >
                              {t('form.step1.donateSpecific')}
                            </button>
                            <button
                              onClick={() => {
                                setValue('donationType', 'general', { shouldValidate: true });
                                setValue('shelterId', undefined, { shouldValidate: true });
                              }}
                              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 transition-colors text-sm sm:text-base font-medium text-center ${
                                donationType === 'general'
                                  ? 'text-white border-[#4F46E5]'
                                  : theme === 'dark' 
                                    ? 'text-white border-gray-600 hover:border-gray-500' 
                                    : 'text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ 
                                backgroundColor: donationType === 'general' ? '#4F46E5' : undefined
                              }}
                            >
                              {t('form.step1.donateGeneral')}
                            </button>
                          </div>
                        </div>
                      )}

                      {currentStep === 1 && (
                        <div className="mb-6">
                          <h3 className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`} style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '0px'
                          }}>{t('form.step1.shelterLabel')}</h3>
                          <label className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1 block`} style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '0px',
                          }}>
                            {t('form.step1.shelterLabel')} {donationType === 'general' && <span className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-normal`}>{t('form.step1.shelterOptional')}</span>}
                          </label>
                          <Select
                            placeholder={t('form.step1.shelterPlaceholder')}
                            data={shelters.map(shelter => ({ value: shelter.id.toString(), label: shelter.name }))}
                            value={selectedShelter?.toString()}
                            onChange={(value) => setValue('shelterId', value ? parseInt(value) : undefined, { shouldValidate: true })}
                            className="w-full"
                            size="md"
                            error={errors.shelterId?.message}
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
                          <h3 className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`} style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '0px'
                          }}>
                            {t('form.step1.amountLabel')}
                          </h3>
                          
                          <div className="mb-6">
                            <div className={`flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold pb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              <div className="border-b-2 border-[#4F46E5] px-2 pb-1">
                                <input
                                  ref={amountRef}
                                  type="number"
                                  value={customAmount || amount}
                                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleNext();
                                    }
                                  }}
                                  className={`bg-transparent border-none outline-none text-2xl sm:text-3xl lg:text-4xl font-bold w-20 sm:w-24 lg:w-28 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors duration-300 ${(customAmount || amount) === 0 ? (theme === 'dark' ? 'text-gray-500' : 'text-gray-400') : (theme === 'dark' ? 'text-white' : 'text-gray-900')}`}
                                  placeholder={t('form.step1.amountPlaceholder')}
                                  min="1"
                                />
                                <span className={`ml-1 sm:ml-2 text-lg sm:text-xl lg:text-2xl transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>€</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {predefinedAmounts.map((predefinedAmount) => (
                              <button
                                key={predefinedAmount}
                                onClick={() => handleAmountSelect(predefinedAmount)}
                                className={`py-2 sm:py-1.5 px-1 sm:px-1 rounded-lg border-2 transition-colors font-semibold text-xs sm:text-sm ${
                                  amount === predefinedAmount && !customAmount
                                    ? 'text-white border-[#4F46E5]'
                                    : theme === 'dark'
                                      ? 'text-white border-gray-600 hover:border-gray-500'
                                      : 'text-gray-700 border-gray-300 hover:border-gray-400'
                                }`}
                                style={{ backgroundColor: amount === predefinedAmount && !customAmount ? '#4F46E5' : undefined }}
                              >
                                {predefinedAmount} €
                              </button>
                            ))}
                          </div>
                          {errors.amount && (
                            <p className="text-red-500 text-sm mt-2">{errors.amount.message}</p>
                          )}
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="mb-6">
                          <div className="mb-6">
                            <h3 className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`} style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 600,
                              fontSize: '16px',
                              lineHeight: '24px',
                              letterSpacing: '0px'
                            }}>{t('form.step2.aboutYou')}</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1 block`} style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  lineHeight: '20px',
                                  letterSpacing: '0px',
                                }}>{t('form.step2.firstName')}</label>
                            <TextInput
                              placeholder={t('form.step2.firstNamePlaceholder')}
                              {...register('firstName')}
                              size="md"
                              className="lg:size-lg"
                              error={errors.firstName?.message}
                              onKeyDown={(e) => handleKeyDown(e, 'input[placeholder*="priezvisko"], input[placeholder*="last name"], input[placeholder*="příjmení"]')}
                              styles={{
                                input: { backgroundColor: '#f3f4f6' }
                              }}
                            />
                              </div>
                              <div>
                                <label className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1 block`} style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  lineHeight: '20px',
                                  letterSpacing: '0px',
                                }}>{t('form.step2.lastName')}</label>
                            <TextInput
                              placeholder={t('form.step2.lastNamePlaceholder')}
                              {...register('lastName')}
                              size="md"
                              className="lg:size-lg"
                              error={errors.lastName?.message}
                              onKeyDown={(e) => handleKeyDown(e, 'input[placeholder*="e-mail"], input[placeholder*="email"]')}
                              styles={{
                                input: { backgroundColor: '#f3f4f6' }
                              }}
                            />
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <label className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1 block`} style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '0px',
                            }}>{t('form.step2.email')}</label>
                            <TextInput
                              placeholder={t('form.step2.emailPlaceholder')}
                              {...register('email')}
                              size="md"
                              className="lg:size-lg"
                              error={errors.email?.message}
                              onKeyDown={(e) => handleKeyDown(e, 'input[placeholder*="123 123 123"]')}
                              styles={{
                                input: { backgroundColor: '#f3f4f6' }
                              }}
                            />
                          </div>

                          <div className="mb-6">
                            <label className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1 block`} style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '0px',
                            }}>{t('form.step2.phone')}</label>
                            <div className="flex gap-2">
                              <Select
                                data={[
                                  { value: '+421', label: '+421' },
                                  { value: '+420', label: '+420' }
                                ]}
                                renderOption={({ option }) => (
                                  <div className="flex items-center gap-2">
                                    {option.value === '+421' ? (
                                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 19.9997C15.5228 19.9997 20 15.5225 20 9.9997C20 8.77649 19.78 7.60474 19.378 6.52145H0.621992C0.220039 7.60474 0 8.77649 0 9.9997C0 15.5225 4.47719 19.9997 10 19.9997Z" fill="#0052B4"/>
                                        <path d="M10.0001 19.9997C14.2997 19.9997 17.9652 17.2859 19.3781 13.4779H0.62207C2.035 17.2859 5.70043 19.9997 10.0001 19.9997Z" fill="#D80027"/>
                                        <path d="M2.58545 5.65158V10.6401C2.58545 13.4778 6.29252 14.3472 6.29252 14.3472C6.29252 14.3472 9.99955 13.4778 9.99955 10.6401V5.65158H2.58545Z" fill="#F0F0F0"/>
                                        <path d="M3.45532 5.65158V10.6401C3.45532 10.9732 3.52931 11.2878 3.67587 11.5828C5.13032 11.5828 7.30423 11.5828 8.90974 11.5828C9.0563 11.2879 9.13028 10.9732 9.13028 10.6401V5.65158H3.45532Z" fill="#D80027"/>
                                        <path d="M8.0322 9.13013H6.7279V8.26055H7.59747V7.39098H6.7279V6.52145H5.85833V7.39098H4.9888V8.26055H5.85833V9.13013H4.55396V9.9997H5.85833V10.8693H6.7279V9.9997H8.0322V9.13013Z" fill="#F0F0F0"/>
                                        <path d="M4.86184 12.7977C5.42219 13.1499 5.99789 13.3543 6.29262 13.4453C6.58734 13.3544 7.16305 13.1499 7.7234 12.7977C8.28848 12.4426 8.68461 12.0364 8.90953 11.5839C8.66145 11.4084 8.35875 11.3048 8.03176 11.3048C7.9127 11.3048 7.79703 11.3189 7.68582 11.3448C7.45016 10.8094 6.9152 10.4353 6.29266 10.4353C5.67012 10.4353 5.13512 10.8094 4.89949 11.3448C4.78828 11.3189 4.67258 11.3048 4.55355 11.3048C4.22656 11.3048 3.92387 11.4084 3.67578 11.5839C3.90059 12.0364 4.29672 12.4425 4.86184 12.7977Z" fill="#0052B4"/>
                                      </svg>
                                    ) : (
                                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                    <span className="text-sm font-medium">{option.value}</span>
                                  </div>
                                )}
                                value={countryCode}
                                onChange={(value) => setValue('countryCode', (value as '+420' | '+421') || '+421', { shouldValidate: true })}
                                size="md"
                                className="w-20 sm:w-24 lg:size-lg"
                                leftSection={
                                  <div className="flex items-center justify-center w-full">
                                    {countryCode === '+421' ? (
                                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 19.9997C15.5228 19.9997 20 15.5225 20 9.9997C20 8.77649 19.78 7.60474 19.378 6.52145H0.621992C0.220039 7.60474 0 8.77649 0 9.9997C0 15.5225 4.47719 19.9997 10 19.9997Z" fill="#0052B4"/>
                                        <path d="M10.0001 19.9997C14.2997 19.9997 17.9652 17.2859 19.3781 13.4779H0.62207C2.035 17.2859 5.70043 19.9997 10.0001 19.9997Z" fill="#D80027"/>
                                        <path d="M2.58545 5.65158V10.6401C2.58545 13.4778 6.29252 14.3472 6.29252 14.3472C6.29252 14.3472 9.99955 13.4778 9.99955 10.6401V5.65158H2.58545Z" fill="#F0F0F0"/>
                                        <path d="M3.45532 5.65158V10.6401C3.45532 10.9732 3.52931 11.2878 3.67587 11.5828C5.13032 11.5828 7.30423 11.5828 8.90974 11.5828C9.0563 11.2879 9.13028 10.9732 9.13028 10.6401V5.65158H3.45532Z" fill="#D80027"/>
                                        <path d="M8.0322 9.13013H6.7279V8.26055H7.59747V7.39098H6.7279V6.52145H5.85833V7.39098H4.9888V8.26055H5.85833V9.13013H4.55396V9.9997H5.85833V10.8693H6.7279V9.9997H8.0322V9.13013Z" fill="#F0F0F0"/>
                                        <path d="M4.86184 12.7977C5.42219 13.1499 5.99789 13.3543 6.29262 13.4453C6.58734 13.3544 7.16305 13.1499 7.7234 12.7977C8.28848 12.4426 8.68461 12.0364 8.90953 11.5839C8.66145 11.4084 8.35875 11.3048 8.03176 11.3048C7.9127 11.3048 7.79703 11.3189 7.68582 11.3448C7.45016 10.8094 6.9152 10.4353 6.29266 10.4353C5.67012 10.4353 5.13512 10.8094 4.89949 11.3448C4.78828 11.3189 4.67258 11.3048 4.55355 11.3048C4.22656 11.3048 3.92387 11.4084 3.67578 11.5839C3.90059 12.0364 4.29672 12.4425 4.86184 12.7977Z" fill="#0052B4"/>
                                      </svg>
                                    ) : (
                                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                    backgroundColor: '#f3f4f6',
                                    color: 'transparent',
                                    textShadow: 'none',
                                    fontSize: '0px'
                                  }
                                }}
                              />
                              <TextInput
                                placeholder={t('form.step2.phonePlaceholder')}
                                value={phone}
                                onChange={(e) => {
                                  const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                                  
                                  let formatted = numbersOnly;
                                  if (numbersOnly.length > 3) {
                                    formatted = numbersOnly.slice(0, 3) + ' ' + numbersOnly.slice(3);
                                  }
                                  if (numbersOnly.length > 6) {
                                    formatted = numbersOnly.slice(0, 3) + ' ' + numbersOnly.slice(3, 6) + ' ' + numbersOnly.slice(6, 9);
                                  }
                                  
                                  setValue('phone', formatted, { shouldValidate: true });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleNext();
                                  }
                                }}
                                leftSection={<span style={{ color: "black", fontWeight: "normal", fontSize: "16px", fontFamily: "inherit", marginRight: "8px" }}>{countryCode}</span>}
                                size="md"
                                className="flex-1 lg:size-lg"
                                error={errors.phone?.message}
                                styles={{
                                  input: { 
                                    backgroundColor: '#f6f7f9',
                                    color: '#1a1a1a',
                                    '::placeholder': { color: '#9ca3af' }
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
                            <h3 className={`text-lg font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('form.step3.summary')}</h3>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t('form.step3.helpForm')}</span>
                                <span className={`font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {donationType === 'general' 
                                    ? t('form.donationTypes.general')
                                    : t('form.donationTypes.shelter')
                                  }
                                </span>
                              </div>
                              {donationType === 'shelter' && selectedShelter && (
                                <div className="flex justify-between items-center">
                                  <span className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t('form.step3.shelter')}</span>
                                  <span className={`font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedShelter}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <span className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t('form.step3.amount')}</span>
                                <span className={`font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {customAmount ? `${customAmount} €` : `${amount} €`}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className={`border-t pt-6 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t('form.step3.nameSurname')}</span>
                                <span className={`font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{firstName} {lastName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t('form.step3.email')}</span>
                                <span className={`font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{email}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t('form.step3.phone')}</span>
                                <span className={`font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{countryCode} {phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className={`border-t pt-4 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                            <Checkbox
                              checked={consent}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setValue('gdprConsent', event.currentTarget.checked, { shouldValidate: true });
                              }}
                              label={t('form.step3.gdprConsent')}
                              size="md"
                              error={errors.gdprConsent?.message}
                              styles={{
                                label: {
                                  fontSize: '14px',
                                  lineHeight: '20px',
                                  color: theme === 'dark' ? '#ffffff' : '#374151'
                                },
                                input: {
                                  backgroundColor: theme === 'dark' ? (consent ? '#374151' : '#1f2937') : (consent ? '#f3f4f6' : 'white'),
                                  borderColor: '#4F46E5',
                                  '&:checked': {
                                    backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                                    borderColor: '#4F46E5'
                                  }
                                },
                                icon: {
                                  color: theme === 'dark' ? '#ffffff' : '#4F46E5'
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                      </div>

                      <div className="h-12 flex justify-between items-center mt-2 gap-2 sm:gap-4">
                        <button
                          onClick={handlePrevious}
                          disabled={currentStep === 1}
                          className={`flex items-center px-4 sm:px-6 lg:px-6 py-2 sm:py-3 lg:py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base lg:text-base font-medium ${
                            theme === 'dark' 
                              ? 'text-white bg-gray-700 hover:bg-gray-600' 
                              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          ← {t('form.navigation.back')}
                        </button>
                        
                        <button
                          onClick={handleNext}
                          disabled={isSubmitting}
                          className="flex items-center px-6 sm:px-8 lg:px-8 py-2 sm:py-3 lg:py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base lg:text-base font-medium"
                          style={{ 
                            backgroundColor: '#4F46E5'
                          }}
                        >
                          {isSubmitting ? t('form.navigation.submitting') : (currentStep === 3 ? t('form.navigation.submit') : t('form.navigation.continue'))}
                        </button>
                      </div>

                    </div>
                    <Footer />
          </div>

                  <div className="lg:col-span-2 hidden lg:block">
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
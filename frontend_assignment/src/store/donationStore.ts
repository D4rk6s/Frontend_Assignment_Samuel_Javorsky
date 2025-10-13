import { create } from 'zustand';
import { DonationFormData } from '@/lib/validation';

interface DonationStore {
  currentStep: number;
  formData: Partial<DonationFormData>;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<DonationFormData>) => void;
  resetForm: () => void;
}

const initialFormData: Partial<DonationFormData> = {
  donationType: 'general',
  countryCode: '+421',
  gdprConsent: false,
};

export const useDonationStore = create<DonationStore>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  updateFormData: (data) => 
    set((state) => ({ 
      formData: { ...state.formData, ...data } 
    })),
  
  resetForm: () => set({ 
    currentStep: 1, 
    formData: initialFormData 
  }),
}));

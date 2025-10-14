import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  currentStep: number;
  isLoading: boolean;
  isSubmitting: boolean;
  theme: 'light' | 'dark';
  language: 'sk' | 'en';
  
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'sk' | 'en') => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      currentStep: 1,
      isLoading: false,
      isSubmitting: false,
      theme: 'light',
      language: 'sk',
      
      setCurrentStep: (step: number) => set({ currentStep: step }),
      
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1 });
        }
      },
      
      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setSubmitting: (submitting: boolean) => set({ isSubmitting: submitting }),
      
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
      
      setLanguage: (language: 'sk' | 'en') => set({ language }),
      
      reset: () => set({
        currentStep: 1,
        isLoading: false,
        isSubmitting: false,
        theme: 'light',
        language: 'sk',
      }),
    }),
    {
      name: 'app-store',
    }
  )
);

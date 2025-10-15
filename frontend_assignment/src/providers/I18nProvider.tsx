'use client';

import { useEffect } from 'react';
import '@/lib/i18n';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
  }, []);

  return <>{children}</>;
};

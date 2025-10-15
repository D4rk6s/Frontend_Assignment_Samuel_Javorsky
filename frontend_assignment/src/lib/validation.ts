import { z } from 'zod';

export const donationFormSchema = z.object({
  donationType: z.enum(['general', 'shelter']),
  shelterId: z.number().optional(),
  amount: z.number().min(1, 'Suma je povinná'),
  customAmount: z.number().min(0, 'Vlastná suma musí byť aspoň 0').optional(),
  firstName: z.string().min(2, 'Meno musí mať aspoň 2 znaky').max(20, 'Meno môže mať maximálne 20 znakov').or(z.literal('')),
  lastName: z.string().min(2, 'Priezvisko musí mať aspoň 2 znaky').max(30, 'Priezvisko môže mať maximálne 30 znakov'),
  email: z.string().email('Neplatný email'),
  phone: z.string().min(1, 'Telefónne číslo je povinné').regex(/^[\d\s]+$/, 'Telefónne číslo musí mať formát 123 123 123 (9 číslic)'),
  countryCode: z.enum(['+420', '+421']),
  gdprConsent: z.boolean().refine(val => val === true, 'Súhlas s GDPR je povinný'),
}).refine((data) => {
  if (data.donationType === 'shelter' && !data.shelterId) {
    return false;
  }
  return true;
}, {
  message: 'Útulok je povinný',
  path: ['shelterId'],
}).refine((data) => {
  const cleanPhone = data.phone.replace(/\s/g, '');
  return /^\d{9}$/.test(cleanPhone);
}, {
  message: 'Telefónne číslo musí mať formát 123 123 123 (9 číslic)',
  path: ['phone'],
});

export type DonationFormData = z.infer<typeof donationFormSchema>;

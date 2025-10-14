import { z } from 'zod';

export const donationFormSchema = z.object({
  donationType: z.enum(['general', 'shelter']),
  shelterId: z.number().optional(),
  amount: z.number().min(1, 'Suma musí byť aspoň 1'),
  customAmount: z.number().min(1, 'Vlastná suma musí byť aspoň 1').optional(),
  firstName: z.string().min(2, 'Meno musí mať aspoň 2 znaky').max(20, 'Meno môže mať najviac 20 znakov').or(z.literal('')),
  lastName: z.string().min(2, 'Priezvisko musí mať aspoň 2 znaky').max(30, 'Priezvisko môže mať najviac 30 znakov'),
  email: z.string().email('Neplatná e-mailová adresa'),
  phone: z.string().regex(/^\d+$/, 'Telefónne číslo môže obsahovať len číslice').min(1, 'Telefónne číslo je povinné'),
  countryCode: z.enum(['+420', '+421']),
  gdprConsent: z.boolean().refine(val => val === true, 'Musíte súhlasiť so spracovaním osobných údajov'),
});

export type DonationFormData = z.infer<typeof donationFormSchema>;

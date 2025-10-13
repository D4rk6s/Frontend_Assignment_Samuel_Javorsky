import { z } from 'zod';

export const donationFormSchema = z.object({
  donationType: z.enum(['general', 'shelter']),
  shelterId: z.number().optional(),
  amount: z.number().min(1, 'Amount must be at least 1'),
  customAmount: z.number().min(1, 'Custom amount must be at least 1').optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(20, 'First name must be at most 20 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(30, 'Last name must be at most 30 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d+$/, 'Phone number must contain only numbers').min(1, 'Phone number is required'),
  countryCode: z.enum(['+420', '+421']),
  gdprConsent: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

export type DonationFormData = z.infer<typeof donationFormSchema>;

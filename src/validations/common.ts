import { z } from 'zod';

export const nonEmptyStringSchema = z.string().trim().min(1, 'This field is required');
export const emailSchema = z.email('Enter a valid email address').trim().toLowerCase();
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must include one uppercase letter')
  .regex(/[a-z]/, 'Password must include one lowercase letter')
  .regex(/\d/, 'Password must include one number');
export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(60, 'Name must be at most 60 characters');
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Enter a valid phone number');
export const otpSchema = z.string().trim().length(6, 'Enter the 6 digit OTP');

import { z } from 'zod';

import { emailSchema, nameSchema, passwordSchema } from './common';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password'),
});

export const signUpSchema = z
  .object({
    confirmPassword: z.string().min(8, 'Confirm your password'),
    email: emailSchema,
    fullName: nameSchema,
    password: passwordSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

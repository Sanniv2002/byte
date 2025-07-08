import { z } from 'zod';

export const identifySchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().min(8).optional(),
});
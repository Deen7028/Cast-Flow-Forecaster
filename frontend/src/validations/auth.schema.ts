import * as z from 'zod';

export const loginSchema = z.object({
  Username: z.string().min(1, 'กรุณากรอก Username'),
  Password: z.string().min(1, 'กรุณากรอก Password'),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

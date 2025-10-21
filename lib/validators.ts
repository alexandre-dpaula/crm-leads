import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Informe pelo menos 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha')
});

export const leadSchema = z.object({
  name: z.string().min(2, 'Informe o nome do lead'),
  stageId: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  position: z.number().optional(),
  value: z
    .any()
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = typeof val === 'number' ? val : Number(val);
      return Number.isFinite(parsed) ? parsed : undefined;
    })
    .refine((val) => val === undefined || !Number.isNaN(val), 'Valor inválido'),
  notes: z.string().max(2000).optional()
});

export const stageUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  order: z.number().min(0)
});

export const leadMoveSchema = z.object({
  id: z.string(),
  stageId: z.string(),
  position: z.number()
});

export const profileSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    avatarData: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.newPassword || data.confirmPassword) {
      if (!data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe a senha atual para alterar a senha.',
          path: ['currentPassword']
        });
      }

      if (!data.newPassword || data.newPassword.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nova senha deve ter ao menos 6 caracteres.',
          path: ['newPassword']
        });
      }

      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'As senhas não conferem.',
          path: ['confirmPassword']
        });
      }
    }
  });

export const resetRequestSchema = z.object({
  email: z.string().email()
});

export const resetConfirmSchema = z
  .object({
    token: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword']
  });

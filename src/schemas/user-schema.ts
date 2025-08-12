import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .transform(val => val.trim())
    .refine(val => val.length === 0 || val.length >= 6, {
      message: 'Senha deve ter pelo menos 6 caracteres',
    })
    .optional(), // opcional para edição
  role: z.enum(['user', 'admin']),
  //image: z.string().url('URL inválida').optional(),
})

export type UserSchema = z.infer<typeof userSchema>

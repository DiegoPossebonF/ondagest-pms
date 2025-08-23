import z from 'zod'

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Nome obrigatório'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(8, 'Senha deve ter ao menos 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
      .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
      .regex(/[0-9]/, 'Senha deve conter ao menos um número')
      .regex(/[\W_]/, 'Senha deve conter ao menos um caractere especial'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatório'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Confirmação de senha incorreta',
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>

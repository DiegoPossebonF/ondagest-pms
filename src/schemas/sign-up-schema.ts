import z from 'zod'

export const signupSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres'),
})

export type SignupFormData = z.infer<typeof signupSchema>

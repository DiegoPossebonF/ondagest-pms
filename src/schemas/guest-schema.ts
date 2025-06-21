import { z } from 'zod'

// 🔢 Validação simples de CPF (só estrutura)
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/

// 📱 Validação de telefone brasileiro
const phoneRegex = /^\(?\d{2}\)?\s?(9?\d{4})-?\d{4}$/

export const guestSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email obrigatório'),
  phone: z
    .string()
    .regex(phoneRegex, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  cpf: z.string().min(1, 'CPF obrigatório').regex(cpfRegex, 'CPF inválido'),
  city: z.string().optional(),
  carPlate: z.string().optional().or(z.literal('')),
})

export type GuestSchema = z.infer<typeof guestSchema>

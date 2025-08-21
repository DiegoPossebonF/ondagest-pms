import { z } from 'zod'

// 🔢 Validação simples de CPF
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/

// 🔢 Validação simples de CNPJ
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/

// 📱 Validação de telefone brasileiro
const phoneRegex = /^\(?\d{2}\)?\s?(9?\d{4})-?\d{4}$/

export const organizationSchema = z.object({
  name: z.string().min(1, 'Nome da empresa é obrigatório'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail obrigatório'),
  phone: z
    .string()
    .regex(phoneRegex, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('Website deve ser uma URL válida')
    .optional()
    .or(z.literal('')),
  facebook: z
    .string()
    .url('Facebook deve ser uma URL válida')
    .optional()
    .or(z.literal('')),
  instagram: z
    .string()
    .url('Instagram deve ser uma URL válida')
    .optional()
    .or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  cpf: z.string().regex(cpfRegex, 'CPF inválido').optional().or(z.literal('')),
  cnpj: z
    .string()
    .regex(cnpjRegex, 'CNPJ inválido')
    .optional()
    .or(z.literal('')),
  rules: z.string().optional().or(z.literal('')),
  sharingMessageVoucher: z
    .string()
    .min(10, 'Mensagem muito curta')
    .refine(value => value.includes('[LINK]'), {
      message:
        'Tag [LINK] não informada na mensagem do voucher. Ex: 📎Acesse aqui: [LINK]',
    }),
  sharingMessageReceipt: z
    .string()
    .min(10, 'Mensagem muito curta')
    .refine(value => value.includes('[LINK]'), {
      message:
        'Tag [LINK] não informada na mensagem do recibo. Ex: 📎Acesse aqui: [LINK]',
    }),
  isLegalEntity: z.boolean().default(false),
})

export type OrganizationSchema = z.infer<typeof organizationSchema>

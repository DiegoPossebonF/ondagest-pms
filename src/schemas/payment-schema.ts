import { PaymentType } from '@/app/generated/prisma'
import { z } from 'zod'

export const paymentSchema = z.object({
  bookingId: z.string().min(1, 'Reserva obrigatória'),
  amount: z.preprocess(
    value => {
      if (typeof value === 'string') {
        // Remove tudo que não for dígito
        const onlyDigits = value.replace(/\D/g, '')
        return Number(onlyDigits) / 100
      }
      return value
    },
    z.number().min(0.01, 'Valor deve ser maior que zero')
  ),
  paymentType: z.enum(Object.values(PaymentType) as [string, ...string[]]),
  paidAt: z.date({
    required_error: 'Data do pagamento obrigatória',
    invalid_type_error: 'Data inválida',
  }),
})

export type PaymentSchema = z.infer<typeof paymentSchema>

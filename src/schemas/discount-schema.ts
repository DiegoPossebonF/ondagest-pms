/*
    model Discount {
        id         String   @id @default(cuid())
        bookingId  Int
        booking    Booking  @relation(fields: [bookingId], references: [id])
        reason     String   
        amount     Float  
    }
*/

import { z } from 'zod'

export const discountSchema = z.object({
  bookingId: z.string().min(1, 'Reserva obrigatória'),
  reason: z.string().min(1, 'Informe a razão do desconto'),
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
})

export type DiscountSchema = z.infer<typeof discountSchema>

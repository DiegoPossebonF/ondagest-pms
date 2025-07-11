/*
    model Service {
      id         String   @id @default(cuid())
      bookingId  Int
      booking    Booking  @relation(fields: [bookingId], references: [id])
      name       String   
      amount     Float
      createdAt  DateTime @default(now())
    }
*/

import { z } from 'zod'

export const serviceSchema = z.object({
  bookingId: z.string().min(1, 'Reserva obrigatória'),
  name: z.string().min(1, 'O nome do serviço é obrigatório'),
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

export type ServiceSchema = z.infer<typeof serviceSchema>

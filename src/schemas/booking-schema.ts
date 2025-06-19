import { BookingStatus } from '@/app/generated/prisma'
import { z } from 'zod'

export const bookingSchema = z.object({
  status: z.enum(Object.values(BookingStatus) as [string, ...string[]]),
  guestId: z.string().min(1, 'Hóspede obrigatório'),
  period: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine(data => data.from < data.to, {
      message: 'A data de check-out deve ser depois da data de check-in',
      path: ['to'],
    }),
  unitId: z.string().min(1, 'Unidade obrigatória'),
  numberOfPeople: z.coerce.number().min(1, 'Mínimo de 1 pessoa'),
  rateId: z.string().min(1, 'Tarifa obrigatória'),
  daily: z.coerce.number().min(1, 'Valor da diária obrigatório'),
  totalAmount: z.number().min(0, 'Valor inválido'),
})

export type BookingSchema = z.infer<typeof bookingSchema>

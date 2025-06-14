import { BookingStatus } from '@/app/generated/prisma'
import { z } from 'zod'

export const bookingSchema = z
  .object({
    status: z.enum(Object.values(BookingStatus) as [string, ...string[]]),
    guestId: z.string().min(1, 'Hóspede obrigatório'),
    period: z.object(
      {
        from: z.date(),
        to: z.date(),
      },
      {
        required_error: 'Please select a date range',
      }
    ),
    unitId: z.string().min(1, 'Unidade obrigatória'),
    numberOfPeople: z.coerce.number().min(1, 'Mínimo de 1 pessoa'),
    selectedRateName: z.string().min(1, 'Tarifa obrigatória'),
    daily: z.coerce.number().min(1, 'Valor da diária obrigatório'),
    totalAmount: z.number().min(0, 'Valor inválido'),
  })
  .refine(data => data.period.from < data.period.to, {
    path: ['dateRange'],
    message: 'Data inicial deve ser menor que a data final',
  })

export type BookingSchema = z.infer<typeof bookingSchema>

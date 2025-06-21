import { BookingStatus, PricingMode } from '@/app/generated/prisma'
import { z } from 'zod'

export const bookingSchema = z
  .object({
    status: z.enum(Object.values(BookingStatus) as [string, ...string[]]),
    pricingMode: z.enum(Object.values(PricingMode) as [string, ...string[]]),
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
    rateId: z.string().optional(),
    daily: z.coerce.number().min(1, 'Valor da diária obrigatório').optional(),
    totalAmount: z.number().min(0, 'Valor inválido'),
  })
  .superRefine((data, ctx) => {
    // 🔸 Validação condicional com base no pricingMode

    if (data.pricingMode === 'RATE') {
      // Se for baseado em tarifa, rateId é obrigatório
      if (!data.rateId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rateId'],
          message: 'Diária obrigatória quando o modo é "Tarifa"',
        })
      }
    }

    if (data.pricingMode === 'MANUAL') {
      // Se for manual, daily é obrigatório
      if (!data.daily) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['daily'],
          message: 'Valor da diária obrigatório no modo manual',
        })
      }
    }
  })

export type BookingSchema = z.infer<typeof bookingSchema>

import { z } from 'zod'

/**
 * Validação de cadastro de tarifas
 * 
 * model Rate {
    id             String     @id @default(uuid())
    type           UnitType   @relation(fields: [typeId], references: [id])
    typeId         String
    name           String
    value          Float
    numberOfPeople Int
    bookings       Booking[]  // 🔥 Adiciona relação inversa (opcional, mas recomendado)
    createdAt      DateTime   @default(now())
    updatedAt      DateTime   @updatedAt
  }
 */

export const rateSchema = z.object({
  typeId: z.string().min(1, 'O tipo de unidade é obrigatório'),
  name: z.string().min(1, 'O nome da tarifa é obrigatório'),
  value: z.number().min(0.01, 'O valor deve ser maior que zero'),
  numberOfPeople: z.coerce
    .number()
    .min(1, 'O numero de pessoas deve ser maior que 0'),
})

export type RateSchema = z.infer<typeof rateSchema>

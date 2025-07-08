import { z } from 'zod'

/**
 * Validação de cadastro unidades
 * 
 * model Unit {
    id         String      @id @default(uuid())
    name       String      @unique
    type       UnitType    @relation(fields: [typeId], references: [id])
    typeId     String
    bookings   Booking[]
    createdAt  DateTime    @default(now())
    updatedAt  DateTime    @updatedAt
  }
 */

export const unitSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome da unidade é obrigatório')
    .max(5, 'Limite de 5 caracteres'),
  typeId: z.string().min(1, 'O tipo de unidade é obrigatório'),
})

export type UnitSchema = z.infer<typeof unitSchema>

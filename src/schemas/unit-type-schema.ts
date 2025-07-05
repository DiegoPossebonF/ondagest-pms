import { z } from 'zod'

/**
 * Validação de cadastro de tipos de unidades
 * 
 * model UnitType {
      id             String      @id @default(uuid())
      name           String      @unique
      description    String
      numberOfPeople Int
      units          Unit[]
      rates          Rate[]
      createdAt      DateTime    @default(now())
      updatedAt      DateTime    @updatedAt
    }
 */

export const unitTypeSchema = z.object({
  name: z.string().min(1, 'O nome do tipo de unidade  obrigat rio'),
  description: z
    .string()
    .min(1, 'A descrição do tipo de unidade é obrigatória'),
  numberOfPeople: z.coerce
    .number()
    .min(1, 'O numero de pessoas deve ser maior que 0'),
})

export type UnitTypeSchema = z.infer<typeof unitTypeSchema>

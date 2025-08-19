// src/actions/booking.ts

'use server'
import { type GuestSchema, guestSchema } from '@/schemas/guest-schema'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

export async function updateGuest(id: string, data: GuestSchema) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const parsed = guestSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, phone, cpf, city, carPlate } = parsed.data

  try {
    await db.guest.update({
      where: { id },
      data: {
        name: name,
        cpf: cpf,
        email: email,
        phone: phone || null,
        city: city || null,
        carPlate: carPlate || null,
      },
    })

    revalidatePath(`/guests/${id}`)
    return {
      success: 'Hóspede atualizado com sucesso!',
    }
  } catch (error) {
    console.error('#### Erro ao atualizar hóspede', error)
    return {
      error: 'Erro ao atualizar hóspede',
    }
  }
}

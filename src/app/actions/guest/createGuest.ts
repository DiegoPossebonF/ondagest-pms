// src/actions/booking.ts

'use server'
import db from '@/lib/db'
import { type GuestSchema, guestSchema } from '@/schemas/guest-schema'
import { revalidatePath } from 'next/cache'

export async function createGuest(data: GuestSchema) {
  const parsed = guestSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, phone, cpf, city, carPlate } = parsed.data

  try {
    const existingEmail = await db.guest.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return { error: 'Email já cadastrado' }
    }

    await db.guest.create({
      data: {
        name: name,
        cpf: cpf,
        email: email,
        phone: phone || null,
        city: city || null,
        carPlate: carPlate || null,
      },
    })

    revalidatePath('/guests')
    return {
      success: 'Hóspede criado com sucesso!',
    }
  } catch (error) {
    console.error('#### Erro ao criar hóspede', error)
    return {
      error: 'Erro ao criar hóspede',
    }
  }
}

'use server'

import { type GuestSchema, guestSchema } from '@/schemas/guest-schema'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

export async function createGuest(data: GuestSchema) {
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
    const existingEmail = await db.guest.findFirst({
      where: { email },
    })

    if (existingEmail) {
      return { error: 'Email já cadastrado' }
    }

    const existingCpf = await db.guest.findFirst({
      where: { cpf },
    })

    if (existingCpf) {
      return { error: 'CPF já cadastrado' }
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

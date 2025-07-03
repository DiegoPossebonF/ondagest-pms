// src/actions/user.ts
'use server'

import db from '@/lib/db'
import { type UserSchema, userSchema } from '@/schemas/user-schema'
import { hashPassword } from '@/utils/hash'
import { revalidatePath } from 'next/cache'

export async function createUser(data: UserSchema) {
  const parsed = userSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, password, role } = parsed.data

  const existingEmail = await db.user.findUnique({
    where: { email },
  })

  if (existingEmail) {
    return { error: 'Email já cadastrado' }
  }

  if (!password || password.length < 6) {
    return { error: 'Senha deve ter pelo menos 6 caracteres' }
  }

  const hashedPassword = await hashPassword(password)

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    revalidatePath('/settings/users')
    return { success: 'Usuário criado com sucesso!' }
  } catch (err) {
    console.error('Erro ao criar usuário:', err)
    return {
      error:
        'Erro ao criar usuário. Por favor, tente novamente mais tarde, ou contate o suporte.',
    }
  }
}

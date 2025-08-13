// src/actions/user.ts
'use server'
import crypto from 'node:crypto'
import db from '@/lib/db'
import { type UserSchema, userSchema } from '@/schemas/user-schema'
import { hashPassword } from '@/utils/hash'
import { revalidatePath } from 'next/cache'
import { sendVerificationEmail } from '../auth/send-verification-email'

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

  if (!password || password.length < 8) {
    return { error: 'Senha deve ter pelo menos 8 caracteres' }
  }

  const hashedPassword = await hashPassword(password)

  try {
    const token = crypto.randomBytes(32).toString('hex')

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerifyToken: token,
        role,
      },
    })

    const { success, error } = await sendVerificationEmail(email, name, token)

    if (error) {
      return { error }
    }

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

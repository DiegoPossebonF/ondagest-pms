'use server'
import dbDefault from '@/lib/db'
import { type UserSchema, userSchema } from '@/schemas/user-schema'
import { hashPassword } from '@/utils/hash'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'

export async function updateUser(id: string, data: UserSchema) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const parsed = userSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, password, role } = parsed.data

  const existingEmail = await dbDefault.user.findUnique({
    where: { email, NOT: { id } },
  })

  if (existingEmail) {
    return { error: 'Email já cadastrado' }
  }

  try {
    if (password && password.length >= 6) {
      const hashedPassword = await hashPassword(password)
      await db.user.update({
        where: { id },
        data: {
          name,
          email,
          role,
          password: hashedPassword,
        },
      })
    } else {
      await db.user.update({
        where: { id },
        data: {
          name,
          email,
          role,
        },
      })
    }

    revalidatePath('/settings/users')
    return { success: 'Usuário atualizado com sucesso!' }
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err)
    return { error: 'Erro ao atualizar usuário.' }
  }
}

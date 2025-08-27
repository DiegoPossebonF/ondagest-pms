'use server'
import { randomBytes } from 'node:crypto'
import dbDefault from '@/lib/db'
import { type UserSchema, userSchema } from '@/schemas/user-schema'
import { hashPassword } from '@/utils/hash'
import { addHours } from 'date-fns'
import { revalidatePath } from 'next/cache'
import { sendVerificationEmail } from '../auth/send-verification-email'
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

  try {
    let sendVerification = false
    // Verifica se o usuário existe
    const user = await db.user.findUnique({
      where: { id },
    })

    if (!user) {
      return { error: 'Usuário não encontrado.' }
    }

    // verifica se email foi alterado
    if (user.email !== email) {
      // Verifica se o email novo ja foi cadastrado na aplicação
      const existingEmail = await dbDefault.user.findUnique({
        where: { email },
      })

      if (existingEmail) {
        return { error: 'Email já cadastrado' }
      }

      // Envia email de verificação
      const token = randomBytes(32).toString('hex')
      const expires = addHours(new Date(), 2)
      // Salva token no banco
      await dbDefault.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      })

      sendVerification = true
      await sendVerificationEmail(email, name, token)
    }

    // Verifica se senha foi alterada

    if (password && password.length >= 8) {
      const hashedPassword = await hashPassword(password)
      await db.user.update({
        where: { id },
        data: {
          name,
          email,
          role,
          password: hashedPassword,
          emailVerified: sendVerification ? null : user.emailVerified,
        },
      })
    } else {
      await db.user.update({
        where: { id },
        data: {
          name,
          email,
          role,
          emailVerified: sendVerification ? null : user.emailVerified,
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

'use server'
import { randomBytes } from 'node:crypto'
import db from '@/lib/db'
import { type SignupFormData, signupSchema } from '@/schemas/sign-up-schema'
import { hash } from 'bcryptjs'
import { addHours } from 'date-fns/addHours'
import { sendVerificationEmail } from './send-verification-email'

export async function signup(data: SignupFormData) {
  const parsed = signupSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map(e => e.message).join(', '),
    }
  }

  const { name, email, password, confirmPassword } = parsed.data

  if (password !== confirmPassword) {
    return {
      success: false,
      error: 'Confirmação de senha incorreta',
    }
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Email já cadastrado',
      }
    }

    // Cria organização

    const organization = await db.organization.create({
      data: {
        name: 'Nova Empresa',
        email,
      },
    })

    const hashedPassword = await hash(password, 10)

    const createdUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        role: 'OWNER',
        organizationId: organization.id,
      },
    })

    if (!createdUser) {
      return {
        success: false,
        error: 'Erro ao criar usuário',
      }
    }

    const token = randomBytes(32).toString('hex')
    const expires = addHours(new Date(), 2)
    // 4. Salva token no banco
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    const { success, error } = await sendVerificationEmail(email, name, token)

    if (error) {
      return {
        success: false,
        error: error,
      }
    }

    return {
      success: 'Conta criada com sucesso',
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Erro inesperado ao criar usuário. Tente novamente mais tarde.',
    }
  }
}

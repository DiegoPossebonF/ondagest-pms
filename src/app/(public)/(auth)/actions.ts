'use server'

import crypto from 'node:crypto'
import { sendVerificationEmail } from '@/app/actions/auth/send-verification-email'
import { signIn, signOut } from '@/lib/auth'
import db from '@/lib/db'
import { type SignupFormData, signupSchema } from '@/schemas/sign-up-schema'
import { hash } from 'bcryptjs'

export async function signinAction(email: string, password: string) {
  try {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      return { success: false, error: res.error }
    }

    return { success: true }
  } catch (e) {
    const err = e as { type?: string; code?: string }

    if (err.type === 'CredentialsSignin' && err.code === 'credentials') {
      return { success: false, error: 'Email ou senha incorretos!' }
    }

    if (err.type === 'CredentialsSignin' && err.code === 'EmailVerifiedError') {
      return {
        success: false,
        error:
          'Email não verificado. Verifique sua caixa de entrada do e-mail de cadastro e efetue a confirmação.',
      }
    }

    console.error('[Login Error]', err)
    return {
      success: false,
      error: 'Ocorreu um erro ao fazer login, tente novamente mais tarde.',
    }
  }
}

export async function signupAction(data: SignupFormData) {
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
    const token = crypto.randomBytes(32).toString('hex')

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Email já cadastrado',
      }
    }

    const hashedPassword = await hash(password, 10)

    const createdUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        emailVerifyToken: token,
      },
    })

    if (!createdUser) {
      return {
        success: false,
        error: 'Erro ao criar usuário',
      }
    }

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

export async function signoutAction() {
  await signOut()
}

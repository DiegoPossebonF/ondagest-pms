'use server'

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
        error: 'Confirme seu email antes de entrar.',
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
      error: parsed.error.errors.map(e => e.message).join(', '),
    }
  }

  const { name, email, password } = parsed.data

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        error: 'Email já cadastrado',
      }
    }

    const hashedPassword = await hash(password, 10)

    const createdUser = await db.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        emailVerified: null,
      },
    })

    if (!createdUser) {
      return {
        error: 'Erro ao criar usuário',
      }
    }

    return {
      error: null,
    }
  } catch (error) {
    return {
      error: 'Erro inesperado ao criar usuário. Tente novamente mais tarde.',
    }
  }
}

export async function signoutAction() {
  await signOut()
}

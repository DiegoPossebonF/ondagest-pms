'use server'
import type { SignupFormData } from '@/components/auth/SignupForm'
import { signIn, signOut } from '@/lib/auth'
import db from '@/lib/db'
import { hash } from 'bcryptjs'

export async function signinAction(email: string, password: string) {
  try {
    await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    return { success: true }
  } catch (e) {
    const err = e as { type?: string }

    if (err.type === 'CredentialsSignin') {
      return { success: false, error: 'Email ou senha incorretos!' }
    }

    console.error('[Login Error]', err)
    return {
      success: false,
      error: 'Ocorreu um erro ao fazer login, tente novamente mais tarde.',
    }
  }
}

export async function signupAction(user: SignupFormData) {
  try {
    if (!user.name || !user.email || !user.password) {
      return {
        success: false,
        error: 'Todos os campos são obrigatórios',
      }
    }

    const existingUser = await db.user.findUnique({
      where: { email: user.email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Email já cadastrado',
      }
    }

    const hashedPassword = await hash(user.password, 10)

    const createdUser = await db.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    })

    if (!createdUser) {
      return {
        success: false,
        error: 'Erro ao criar usuário',
      }
    }

    return {
      success: true,
      data: createdUser,
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

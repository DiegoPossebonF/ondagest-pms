'use server'
import { signIn } from '@/lib/auth'
import { checkRateLimit, getClientIp, loginLimiter } from '@/lib/rate-limit'

export async function signin(email: string, password: string) {
  const ip = await getClientIp()
  const { success: allowed } = await checkRateLimit(loginLimiter, `login:${ip}`)
  if (!allowed) {
    return {
      success: false,
      error: 'Muitas tentativas de login. Tente novamente mais tarde.',
    }
  }

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

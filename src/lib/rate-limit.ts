import { type Duration, Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { headers } from 'next/headers'

/**
 * Cria um limiter do Upstash Ratelimit. Retorna `null` se as variáveis de
 * ambiente do Redis não estiverem configuradas (ex.: desenvolvimento local),
 * desativando o rate limiting de forma segura.
 */
function createLimiter(requests: number, window: Duration): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  const redis = new Redis({ url, token })

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: 'ondagest:ratelimit',
  })
}

const loginLimiter = createLimiter(10, '10 m')
const signupLimiter = createLimiter(5, '1 h')
const forgotPasswordLimiter = createLimiter(3, '1 h')
const resetPasswordLimiter = createLimiter(10, '1 h')

/**
 * Obtém o IP do cliente. Em server actions, `requestHeaders` é omitido e usamos
 * `headers()`. Em route handlers, passamos `req.headers`.
 */
export async function getClientIp(requestHeaders?: {
  get: (name: string) => string | null
}): Promise<string> {
  const h = requestHeaders ?? (await headers())
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return h.get('x-real-ip') ?? 'unknown'
}

/**
 * Verifica o rate limit. Se o limiter for `null` (sem Redis configurado) ou
 * ocorrer um erro, retorna `success: true` (fail-open) para não bloquear os
 * usuários.
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean }> {
  if (!limiter) {
    return { success: true }
  }

  try {
    const { success } = await limiter.limit(identifier)
    return { success }
  } catch (error) {
    console.error('Erro no rate limiting:', error)
    return { success: true }
  }
}

export {
  loginLimiter,
  signupLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
}

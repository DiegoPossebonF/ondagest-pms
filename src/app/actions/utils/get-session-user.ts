'use server'

import { auth } from '@/lib/auth'

/**
 * Retorna o usuário da sessão atual (id, role, organizationId, etc.),
 * ou `null` se não autenticado.
 *
 * Usado nas server actions que exigem autorização por papel (ADMIN/OWNER).
 */
export async function getSessionUser() {
  const session = await auth()
  if (!session?.user) return null
  return session.user
}

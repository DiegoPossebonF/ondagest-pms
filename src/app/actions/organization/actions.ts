'use server'
import db from '@/lib/db'
import type { Organization } from '@prisma/client'

export async function getOrganization() {
  try {
    const organization: Organization | null = await db.organization.findFirst()

    if (!organization)
      return {
        error: 'Nenhuma organização encontrada',
        data: null,
      }

    return {
      data: organization,
    }
  } catch (error) {
    console.error('Erro ao buscar os dados da organização', error)
    return {
      error:
        'Erro ao buscar os dados da organização - tente novamente ou contate o suporte!',
      data: null,
    }
  }
}

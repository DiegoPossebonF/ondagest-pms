import type { Organization } from '@/app/generated/prisma'
import db from '@/lib/db'

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

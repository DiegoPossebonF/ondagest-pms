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

// criar update logoUrl in organization

export async function updateOrganizationLogo(
  organizationId: string,
  logoUrl: string
) {
  try {
    const organization = await db.organization.update({
      where: { id: organizationId },
      data: { logoUrl },
    })

    return {
      data: organization,
    }
  } catch (error) {
    console.error('Erro ao atualizar o logo da organização', error)
    return {
      error:
        'Erro ao atualizar o logo da organização - tente novamente ou contate o suporte!',
      data: null,
    }
  }
}

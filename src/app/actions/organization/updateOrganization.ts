// src/actions/booking.ts

'use server'
import db from '@/lib/db'
import {
  type OrganizationSchema,
  organizationSchema,
} from '@/schemas/organization-schema'
import { revalidatePath } from 'next/cache'

export async function updateOrganization(
  organizationId: string,
  data: OrganizationSchema
) {
  const parsed = organizationSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const organization = parsed.data
  let cpf = organization.cpf
  let cnpj = organization.cnpj

  // Verifica se é pessoa fisica ou juridica
  if (organization.isLegalEntity) {
    if (!organization.cnpj) {
      return { error: 'CNPJ obrigatório para pessoa jurídica!' }
    }

    cpf = undefined
    // Não pode ter organização com o mesmo CNPJ, verificar se existe outra organização com o mesmo CNPJ
    const existingOrganization = await db.organization.findFirst({
      where: { cnpj: organization.cnpj, id: { not: organizationId } },
    })

    if (existingOrganization) {
      return { error: 'Organização com o mesmo CNPJ já cadastrada!' }
    }
  } else {
    if (!organization.cpf) {
      return { error: 'CPF obrigatório para pessoa física!' }
    }

    cnpj = undefined

    // Não pode ter organização com o mesmo CPF, verificar se existe outra organização com o mesmo CPF
    const existingOrganization = await db.organization.findFirst({
      where: { cpf: organization.cpf, id: { not: organizationId } },
    })

    if (existingOrganization) {
      return { error: 'Organização com o mesmo CPF já cadastrada!' }
    }
  }

  try {
    const organizationCreated = await db.organization.update({
      where: { id: organizationId },
      data: {
        name: organization.name,
        cnpj: cnpj ?? '',
        cpf: cpf ?? '',
        website: organization.website,
        email: organization.email,
        facebook: organization.facebook,
        instagram: organization.instagram,
        phone: organization.phone,
        address: organization.address,
        city: organization.city,
        state: organization.state,
        zipCode: organization.zipCode,
        country: organization.country,
        rules: organization.rules,
        sharingMessageVoucher: organization.sharingMessageVoucher,
        sharingMessageReceipt: organization.sharingMessageReceipt,
        isSetupCompleted: true,
      },
    })

    revalidatePath('/settings/organization')
    return {
      success: 'Organização atualizada com sucesso!',
      data: organizationCreated,
    }
  } catch (error) {
    console.error('#### Erro ao atualizar organização', error)
    return {
      error:
        'Erro ao atualizar organização - tente novamente ou contate o suporte!',
    }
  }
}

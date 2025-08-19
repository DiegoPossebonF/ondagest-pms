// src/actions/booking.ts

'use server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import {
  type OrganizationSchema,
  organizationSchema,
} from '@/schemas/organization-schema'
import { revalidatePath } from 'next/cache'

export async function createOrganization(data: OrganizationSchema) {
  const session = await auth()
  console.log(session)

  if (!session?.user) {
    return { error: 'Usuário não encontrado!' }
  }

  if (session.user.role !== 'OWNER') {
    return { error: 'Usuário sem permissão!' }
  }

  if (session.user.organizationId) {
    return { error: 'Usuário ja possui uma organização!' }
  }

  const parsed = organizationSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const organization = parsed.data

  // Verifica se é pessoa fisica ou juridica
  if (organization.isLegalEntity) {
    if (!organization.cnpj) {
      return { error: 'CNPJ obrigatório para pessoa jurídica!' }
    }
    // Não pode ter organização com o mesmo CNPJ, verificar se existe outra organização com o mesmo CNPJ
    const existingOrganization = await db.organization.findFirst({
      where: { cnpj: organization.cnpj },
    })

    if (existingOrganization) {
      return { error: 'Organização com o mesmo CNPJ já cadastrada!' }
    }
  } else {
    if (!organization.cpf) {
      return { error: 'CPF obrigatório para pessoa física!' }
    }

    // Não pode ter organização com o mesmo CPF, verificar se existe outra organização com o mesmo CPF
    const existingOrganization = await db.organization.findFirst({
      where: { cpf: organization.cpf },
    })

    if (existingOrganization) {
      return { error: 'Organização com o mesmo CPF já cadastrada!' }
    }
  }

  try {
    const organizationCreated = await db.organization.create({
      data: {
        name: organization.name,
        cnpj: organization.cnpj,
        email: organization.email,
        phone: organization.phone,
        address: organization.address,
        city: organization.city,
        state: organization.state,
        zipCode: organization.zipCode,
        country: organization.country,
        rules: organization.rules,
        invoiceMessageVoucher: organization.invoiceMessageVoucher,
        invoiceMessageReceipt: organization.invoiceMessageReceipt,
      },
    })

    await db.user.update({
      where: { id: session.user.id },
      data: { organizationId: organizationCreated.id },
    })

    revalidatePath('/', 'layout')
    return {
      success: 'Organização criada com sucesso!',
      data: organizationCreated,
    }
  } catch (error) {
    console.error('#### Erro ao criar organização', error)
    return {
      error:
        'Erro ao criar organização - tente novamente ou contate o suporte!',
    }
  }
}

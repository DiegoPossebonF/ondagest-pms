'use server'
import type { Service } from '@/app/generated/prisma'
import db from '@/lib/db'

type ServicePayload = Omit<Service, 'createdAt'>

export async function updateService(service: ServicePayload) {
  try {
    if (!service) {
      return {
        success: false,
        msg: 'Erro ao atualizar serviço - dados inválidos',
      }
    }

    const serviceUpdated = await db.service.update({
      where: { id: service.id },
      data: {
        ...service,
      },
    })

    if (!serviceUpdated) {
      return {
        success: false,
        msg: 'Erro ao atualizar serviço - DB',
      }
    }

    return {
      success: true,
      payment: serviceUpdated,
      msg: 'Serviço atualizado com sucesso',
    }
  } catch (err) {
    console.error('Erro ao atualizar serviço', err)
    return {
      success: false,
      msg: 'Erro interno ao atualizar serviço - entre em contato com o suporte',
    }
  }
}

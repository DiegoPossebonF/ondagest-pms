'use server'
import type { Service } from '@/app/generated/prisma'
import db from '@/lib/db'

type ServiceWithoutId = Omit<Service, 'id' | 'createdAt'>

export async function createService(service: ServiceWithoutId) {
  try {
    const newService = await db.service.create({
      data: {
        ...service,
      },
    })

    if (!newService) {
      return {
        success: false,
        service: null,
        msg: 'Erro ao criar servico',
      }
    }

    return {
      success: true,
      service: newService,
      msg: 'Servico criado com sucesso',
    }
  } catch (error) {
    console.error('Erro ao criar servico', error)
    return {
      success: false,
      service: null,
      msg: 'Erro ao criar servico',
    }
  }
}

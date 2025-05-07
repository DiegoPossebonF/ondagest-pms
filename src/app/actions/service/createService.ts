'use server'
import type { Service } from '@/app/generated/prisma'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

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

    revalidatePath(`/booking/${service.bookingId}`)
    return {
      success: true,
      service: newService,
      msg: 'Serviço lançado com sucesso',
    }
  } catch (error) {
    console.error('Erro ao criar serviço', error)
    return {
      success: false,
      service: null,
      msg: 'Erro ao criar serviço',
    }
  }
}

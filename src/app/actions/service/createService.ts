'use server'

import { type ServiceSchema, serviceSchema } from '@/schemas/service-schema'
import { updateBookingPaymentStatus } from '../booking/updateBookingPaymentStatus'
import dbWithTenant from '../utils/dbWithTenant'

export async function createService(data: ServiceSchema) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const parsed = serviceSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: 'Dados inválidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const service = parsed.data

  try {
    const serviceCreated = await db.service.create({
      data: {
        bookingId: Number(service.bookingId),
        name: service.name,
        amount: service.amount,
      },
    })

    if (!serviceCreated) {
      return {
        error: 'Erro DB ao criar serviço - entre em contato com o suporte!',
      }
    }

    await updateBookingPaymentStatus(Number(service.bookingId))

    return {
      success: 'Serviço lançado com sucesso',
    }
  } catch (err) {
    console.error('Erro ao criar serviço', err)
    return {
      error: 'Erro interno ao criar serviço - entre em contato com o suporte',
    }
  }
}

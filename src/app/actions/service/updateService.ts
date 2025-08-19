'use server'

import { type ServiceSchema, serviceSchema } from '@/schemas/service-schema'
import { revalidatePath } from 'next/cache'
import { updateBookingPaymentStatus } from '../booking/updateBookingPaymentStatus'
import dbWithTenant from '../utils/dbWithTenant'

export async function updateService(serviceId: string, data: ServiceSchema) {
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

  const { name, amount, bookingId } = parsed.data

  try {
    await db.service.update({
      where: { id: serviceId },
      data: {
        name,
        amount,
      },
    })

    await updateBookingPaymentStatus(Number(bookingId))

    revalidatePath(`/bookings/${bookingId}`)
    return {
      success: 'Serviço atualizado com sucesso!',
    }
  } catch (error) {
    console.error('#### Erro ao atualizar Serviço', error)
    return {
      error:
        'Erro ao atualizar Serviço. Por favor, tente novamente mais tarde ou contate o suporte.',
    }
  }
}

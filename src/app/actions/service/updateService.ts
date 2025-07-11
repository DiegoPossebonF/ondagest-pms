// src/actions/booking.ts

'use server'
import db from '@/lib/db'
import { updateBookingPaymentStatus } from '@/lib/db/actions/updateBookingPaymentStatus'
import { type ServiceSchema, serviceSchema } from '@/schemas/service-schema'
import { revalidatePath } from 'next/cache'

export async function updateService(serviceId: string, data: ServiceSchema) {
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

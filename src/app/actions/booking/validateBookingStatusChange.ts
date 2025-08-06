import type { BookingAllIncludes } from '@/types/booking'
import type { BookingStatus } from '@prisma/client'
import calculateBookingValues from './calculateBookingValues'

export default async function validateBookingStatusChange(
  booking: BookingAllIncludes,
  newStatus: BookingStatus
): Promise<{ error?: string }> {
  const { totalAll, totalPayment } = calculateBookingValues(booking)

  // Não pode CANCELAR ou NO_SHOW se houver pagamentos
  if (newStatus === 'CANCELLED' || newStatus === 'NO_SHOW') {
    if (booking.payments.length > 0) {
      return {
        error:
          'Não é possível cancelar ou marcar como no-show pois há pagamentos.',
      }
    }
  }

  // Só pode CHECKED_IN após CONFIRMED
  if (newStatus === 'CHECKED_IN') {
    if (booking.status !== 'CONFIRMED') {
      return { error: 'Só é possível fazer check-in após estar confirmado.' }
    }
  }

  // Só pode IN_PROGRESS após CHECKED_IN
  if (newStatus === 'IN_PROGRESS') {
    if (booking.status !== 'CHECKED_IN' && booking.status !== 'IN_PROGRESS') {
      return { error: 'Só é possível iniciar a estadia após check-in.' }
    }
  }

  // Só pode CHECKED_OUT após IN_PROGRESS
  if (newStatus === 'CHECKED_OUT') {
    if (booking.status !== 'IN_PROGRESS' && booking.status !== 'CHECKED_OUT') {
      return {
        error:
          'Só é possível fazer check-out após a estadia estar em andamento.',
      }
    }
  }

  // Só pode FINALIZED após CHECKED_OUT e se total pago >= total
  if (newStatus === 'FINALIZED') {
    if (booking.status !== 'CHECKED_OUT') {
      return {
        error:
          'Só é possível finalizar na data de check-out ou após. Altere o periodo da reserva para finalizar.',
      }
    }
    if (totalPayment < totalAll) {
      return { error: 'Não é possível finalizar pois ainda há saldo pendente.' }
    }
  }

  return {}
}

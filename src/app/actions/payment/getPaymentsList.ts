'use server'
import { PAYMENT_TYPE_LABELS } from '@/lib/utils'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import dbWithTenant from '../utils/dbWithTenant'

type SortField = 'paidAt' | 'amount' | 'guestName'
type SortDirection = 'asc' | 'desc'

type GetPaymentsListParams = {
  from: Date
  to: Date
  page?: number
  limit?: number
  sortField?: SortField
  sortDirection?: SortDirection
}

export async function getPaymentsList({
  from,
  to,
  page = 1,
  limit = 10,
  sortField = 'paidAt',
  sortDirection = 'desc',
}: GetPaymentsListParams) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const skip = (page - 1) * limit

  const orderBy =
    sortField === 'guestName'
      ? {
          booking: {
            guest: {
              name: sortDirection,
            },
          },
        }
      : {
          [sortField]: sortDirection,
        }

  const [payments, total] = await Promise.all([
    db.payment.findMany({
      where: {
        paidAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        booking: {
          select: {
            id: true,
            guest: { select: { name: true } },
            unit: { select: { name: true, type: { select: { name: true } } } },
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    db.payment.count({
      where: {
        paidAt: {
          gte: from,
          lte: to,
        },
      },
    }),
  ])

  const formatted = payments.map(p => ({
    id: p.id,
    date: dayjs(p.paidAt).locale('pt-br').format('DD/MM/YYYY'),
    guest: p.booking?.guest?.name ?? '-',
    unit: p.booking?.unit?.name
      ? `${p.booking.unit.name} - ${p.booking.unit.type.name}`
      : '-',
    amount: p.amount,
    method:
      PAYMENT_TYPE_LABELS[p.paymentType as keyof typeof PAYMENT_TYPE_LABELS] ??
      'Outro',
    bookingId: p.booking?.id ?? null,
  }))

  return {
    data: formatted,
    total,
    totalPages: Math.ceil(total / limit),
  }
}

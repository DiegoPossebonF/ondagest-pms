// /app/actions/reports/get-payment-methods.ts
'use server'

import db from '@/lib/db'
import { PAYMENT_TYPE_LABELS } from '@/lib/utils'

type Params = {
  from: Date
  to: Date
}

export async function getPaymentMethods({
  from,
  to,
}: Params): Promise<{ method: string; total: number }[]> {
  const payments = await db.payment.findMany({
    where: {
      paidAt: {
        gte: from,
        lte: to,
      },
    },
    select: {
      paymentType: true,
      amount: true,
    },
  })

  const grouped: Record<string, number> = {}

  for (const payment of payments) {
    const method = payment.paymentType || 'Desconhecido'
    grouped[method] = (grouped[method] || 0) + payment.amount
  }

  return Object.entries(grouped).map(([method, total]) => ({
    method:
      PAYMENT_TYPE_LABELS[method as keyof typeof PAYMENT_TYPE_LABELS] ??
      'Desconhecido',
    total,
  }))
}

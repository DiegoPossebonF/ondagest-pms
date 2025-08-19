'use server'
import { eachDayOfInterval, eachMonthOfInterval, format } from 'date-fns'
import dbWithTenant from '../utils/dbWithTenant'

type GroupBy = 'daily' | 'monthly'

type Params = {
  from: Date
  to: Date
  groupBy: GroupBy
}

export async function getRevenue({
  from,
  to,
  groupBy,
}: Params): Promise<{ date: string; total: number }[]> {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const payments = await db.payment.findMany({
    where: {
      paidAt: {
        gte: from,
        lte: to,
      },
    },
    select: {
      paidAt: true,
      amount: true,
    },
  })

  const formatPattern = groupBy === 'monthly' ? 'yyyy-MM' : 'yyyy-MM-dd'

  const intervals =
    groupBy === 'monthly'
      ? eachMonthOfInterval({ start: from, end: to })
      : eachDayOfInterval({ start: from, end: to })

  const grouped = intervals.map(date => {
    const key = format(date, formatPattern)
    const total = payments
      .filter(p => format(p.paidAt, formatPattern) === key)
      .reduce((sum, p) => sum + p.amount, 0)

    return { date: key, total }
  })

  return grouped
}

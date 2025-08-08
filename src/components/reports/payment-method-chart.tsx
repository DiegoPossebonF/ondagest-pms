'use client'

import { getPaymentMethods } from '@/app/actions/reports/get-payment-methods'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { LoadingSpinner } from '../LoadingSpinner'

type Props = {
  range: DateRange | undefined
}

type PaymentEntry = {
  method: string
  total: number
}

export function PaymentMethodChart({ range }: Props) {
  const [data, setData] = useState<PaymentEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      if (!range?.from || !range?.to) return
      setLoading(true)
      const result = await getPaymentMethods({ from: range.from, to: range.to })
      setData(result)
      setLoading(false)
    }

    load()
  }, [range])

  const total = data.reduce((acc, item) => acc + item.total, 0)

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">
              Formas de pagamento
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Total no período:{' '}
              <span className="font-medium">
                {total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[200px]">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <XAxis
                type="number"
                tickFormatter={value =>
                  value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                }
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E4E4E7' }}
                tickLine={false}
              />
              <YAxis
                width={100}
                dataKey="method"
                type="category"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E4E4E7' }}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) =>
                  value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                }
                labelFormatter={(label: string) => label}
              />
              <Bar
                dataKey="total"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

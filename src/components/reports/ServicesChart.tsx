'use client'

import { getServicesReport } from '@/app/actions/reports/get-services-report'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { format, parseISO } from 'date-fns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

type Props = {
  range: DateRange | undefined
}

type ServiceEntry = {
  date: string
  total: number
}

type Granularity = 'daily' | 'monthly'

export function ServicesChart({ range }: Props) {
  const [data, setData] = useState<ServiceEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [granularity, setGranularity] = useState<Granularity>('daily')

  const totalServices = data.reduce((acc, item) => acc + item.total, 0)

  useEffect(() => {
    async function loadData() {
      if (!range?.from || !range?.to) return
      setLoading(true)
      const result = await getServicesReport({
        from: range.from,
        to: range.to,
        groupBy: granularity,
      })

      setData(result)
      setLoading(false)
    }

    loadData()
  }, [range, granularity])

  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">
              Serviços por {granularity === 'monthly' ? 'mês' : 'dia'}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Total no período:{' '}
              <span className="font-medium text-primary">
                {totalServices.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </CardDescription>
          </div>
          <Select
            defaultValue="daily"
            onValueChange={value =>
              setGranularity(value as 'daily' | 'monthly')
            }
          >
            <SelectTrigger className="h-8 w-[110px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Por dia</SelectItem>
              <SelectItem value="monthly">Por mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[200px]">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                tickFormatter={date =>
                  (() => {
                    try {
                      return format(
                        parseISO(date.length === 7 ? `${date}-01` : date),
                        granularity === 'monthly' ? 'MM/yyyy' : 'dd/MM/yyyy'
                      )
                    } catch {
                      return date
                    }
                  })()
                }
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E4E4E7' }}
                tickLine={false}
              />
              <YAxis
                width={80}
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
              <Tooltip
                formatter={(value: number) =>
                  value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                }
                labelFormatter={(label: string) =>
                  `${granularity === 'monthly' ? 'Mês' : 'Dia'} ${format(parseISO(label), granularity === 'monthly' ? 'MM/yyyy' : 'dd/MM/yyyy')}`
                }
              />
              <Bar
                dataKey="total"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

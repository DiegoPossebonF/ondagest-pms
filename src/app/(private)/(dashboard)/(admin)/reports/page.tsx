'use client'

import { PaymentList } from '@/components/payment/PaymentList'
import { PaymentMethodChart } from '@/components/reports/payment-method-chart'
import { RevenueChart } from '@/components/reports/revenue-chart'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { subDays } from 'date-fns'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const components = [
    {
      title: 'Relatório de receitas',
      element: <RevenueChart range={range} />,
    },
    {
      title: 'Relatório de pagamentos',
      element: <PaymentMethodChart range={range} />,
    },
    {
      title: 'Pagamentos no período',
      element:
        range?.from && range?.to ? (
          <PaymentList from={range.from} to={range.to} />
        ) : null,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Relatórios financeiros</h1>

      <div className="max-w-xs">
        <DateRangePicker
          initialDateFrom={range?.from}
          initialDateTo={range?.to}
          onUpdate={({ range }) => setRange(range)}
          showCompare={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0 }}
          className="h-full" // faz o motion.div ocupar toda a altura
        >
          <RevenueChart range={range} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="h-full" // faz o motion.div ocupar toda a altura
        >
          <PaymentMethodChart range={range} />
        </motion.div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {range?.from && range?.to && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            className="h-full" // faz o motion.div ocupar toda a altura
          >
            <PaymentList from={range.from} to={range.to} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

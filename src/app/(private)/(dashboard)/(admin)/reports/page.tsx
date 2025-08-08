'use client'

import { PaymentMethodChart } from '@/components/reports/payment-method-chart'
import { RevenueChart } from '@/components/reports/revenue-chart'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { subDays } from 'date-fns'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

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
        <RevenueChart range={range} />
        <PaymentMethodChart range={range} />
      </div>
    </div>
  )
}

'use client'
import { StatusLegend } from '@/components/StatusLegend'
import { UnitsGanttView } from '@/components/unit/UnitsGanttView'

export default function MapPage() {
  return (
    <div className="flex flex-col p-6 gap-4 overflow-hidden">
      <div className="flex flex-row w-full justify-end items-end">
        <StatusLegend />
      </div>
      <UnitsGanttView />
    </div>
  )
}

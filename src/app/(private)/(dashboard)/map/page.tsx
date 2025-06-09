'use client'
import { BookingStatusLegend } from '@/components/booking/BookingStatusLegend'
import { UnitsGanttView } from '@/components/unit/UnitsGanttView'

export default function MapPage() {
  return (
    <div className="flex flex-col p-6 gap-4 overflow-hidden">
      <div className="flex flex-row w-full justify-end items-end">
        <BookingStatusLegend />
      </div>
      <UnitsGanttView />
    </div>
  )
}

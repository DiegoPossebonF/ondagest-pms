'use client'
import { IconCalendarPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { ButtonTooltip } from '../ButtonTooltip'
import { StatusLegend } from '../StatusLegend'
import BookingsFilters from './BookingsFilters'
import { useBookingFilters } from './BookingsFiltersProvider'

export default function BookingsListHeader() {
  const router = useRouter()
  const { activeFilters, resetFilters } = useBookingFilters()

  return (
    <div className="flex flex-row justify-between gap-2">
      <ButtonTooltip
        icon={<IconCalendarPlus className="w-4 h-4" />}
        tooltipText="Nova reserva"
        className="self-start size-8 group-data-[collapsible=icon]:opacity-0"
        onClick={() => router.push('/bookings/new')}
        tooltipSide="top"
      />
      <div className="flex flex-row gap-2">
        <BookingsFilters />
        <StatusLegend />
      </div>
    </div>
  )
}

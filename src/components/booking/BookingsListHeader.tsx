'use client'
import { Button } from '@/components/ui/button'
import { IconCalendarPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useBookingFilters } from './BookingFiltersProvider'
import { BookingStatusLegend } from './BookingStatusLegend'
import BookingsFilters from './BookingsFilters'

export default function BookingsListHeader() {
  const router = useRouter()
  const { activeFilters, resetFilters } = useBookingFilters()

  return (
    <div className="flex flex-row justify-between gap-2">
      <Button
        variant="outline"
        size="icon"
        className="self-start"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          router.push('/bookings/new')
        }}
      >
        <IconCalendarPlus className="w-4 h-4" />
      </Button>
      <div className="flex flex-row gap-2">
        <BookingsFilters />
        <BookingStatusLegend />
      </div>
    </div>
  )
}

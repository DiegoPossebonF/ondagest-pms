'use client'
import { BookingsFiltersForm } from '@/components/booking/BookingsFiltersForm'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  IconCalendarPlus,
  IconFilterEdit,
  IconFilterX,
} from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useBookingFilters } from './BookingFiltersProvider'

export default function BookingsFilters() {
  const router = useRouter()
  const { filters, activeFilters, handleFilterChange, resetFilters } =
    useBookingFilters()

  return (
    <div className="flex flex-row justify-between gap-2">
      <div className="flex flex-row gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="self-start">
              <IconFilterEdit className="w-4 h-4" /> Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-50">
            <BookingsFiltersForm
              filters={filters}
              onChange={handleFilterChange}
            />
          </PopoverContent>
        </Popover>

        {activeFilters && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => resetFilters()}
          >
            <IconFilterX className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          router.push('/bookings/new')
        }}
      >
        <IconCalendarPlus className="w-4 h-4" />
      </Button>
    </div>
  )
}

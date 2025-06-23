'use client'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { useBookingFilters } from './BookingFiltersProvider'

export default function BookingListFooter() {
  const { page, setPage, totalPages } = useBookingFilters()

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        Página {page} de {totalPages || 1}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

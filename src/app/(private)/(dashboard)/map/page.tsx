import { BookingSheet } from '@/components/booking/BookingSheet'
import { BookingsMap } from '@/components/booking/BookingsMap'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function MapPage() {
  return (
    <main>
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>
          MAPA DE RESERVAS
        </span>
        <BookingSheet>
          <Button variant={'default'}>
            <Plus size={20} />
          </Button>
        </BookingSheet>
      </div>
      <div className="p-6 overflow-auto">
        <BookingsMap />
      </div>
    </main>
  )
}

import { BookingCardButton } from '@/components/booking/BookingCardButton'
import { BookingSheet } from '@/components/booking/BookingSheet'
import { BookingsMap } from '@/components/booking/BookingsMap'
import MageCalendarPlusFill from '@/components/icons/mage/MageCalendarPlusFill'

export default function MapPage() {
  return (
    <main>
      <div className="flex items-center justify-between px-8 py-[18.08px] border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>
          MAPA DE RESERVAS
        </span>
        <BookingSheet>
          <BookingCardButton>
            <MageCalendarPlusFill className="w-6 h-6" />
          </BookingCardButton>
        </BookingSheet>
      </div>
      <div className="p-6 overflow-auto">
        <BookingsMap />
      </div>
    </main>
  )
}

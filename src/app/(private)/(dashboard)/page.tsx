import { BookingCardButton } from '@/components/booking/BookingCardButton'
import { BookingSheet } from '@/components/booking/BookingSheet'
import { BookingStatusLegend } from '@/components/booking/BookingStatusLegend'
import MageCalendarPlusFill from '@/components/icons/mage/MageCalendarPlusFill'
import UnitCard from '@/components/unit/UnitCard'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { getUnitsWithUpdatedBookings } from './actions'

dayjs.extend(isBetween)

export default async function Dashboard() {
  const units = await getUnitsWithUpdatedBookings()

  if (!units) {
    return <div>Erro ao buscar unidades</div>
  }

  return (
    <>
      <main>
        <div className="flex items-center justify-between px-8 py-[18.08px] border-b border-gray-700 bg-blue-200">
          <span className={`font-semibold transition-opacity`}>
            ACOMODAÇÕES
          </span>
          <BookingSheet>
            <BookingCardButton>
              <MageCalendarPlusFill className="w-6 h-6" />
            </BookingCardButton>
          </BookingSheet>
        </div>
        <div className="p-6 overflow-auto flex flex-col gap-4">
          <BookingStatusLegend />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {units.map(unit => {
              return <UnitCard key={unit.id} unit={unit} />
            })}
          </div>
        </div>
      </main>
    </>
  )
}

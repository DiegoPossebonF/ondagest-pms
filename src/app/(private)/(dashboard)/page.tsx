import { BookingStatusLegend } from '@/components/booking/BookingStatusLegend'
import UnitCard from '@/components/unit/UnitCard'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { getUnitsWithUpdatedBookings } from './actions'

dayjs.extend(isBetween)

export default async function Dashboard() {
  const units = await getUnitsWithUpdatedBookings()

  if (!units) {
    return (
      <div className="p-6 overflow-auto flex flex-col items-center justify-center gap-4">
        Erro ao buscar unidades - Entre em contato com o suporte...
      </div>
    )
  }

  return (
    <div className="p-6 overflow-auto flex flex-col gap-4">
      <div className="flex flex-row w-full justify-end items-end">
        <BookingStatusLegend />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
        {units.map(unit => {
          return <UnitCard key={unit.id} unit={unit} />
        })}
      </div>
    </div>
  )
}

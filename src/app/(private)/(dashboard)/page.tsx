'use server'
import { getUnitsUpdatedBookingsByDate } from '@/app/actions/unit/actions'
import { StatusLegend } from '@/components/StatusLegend'
import UnitCard from '@/components/unit/UnitCard'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

export default async function Dashboard() {
  const res = await getUnitsUpdatedBookingsByDate(dayjs().toDate())

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

  return (
    <div className="p-6 overflow-auto flex flex-col gap-4">
      <div className="flex flex-row w-full justify-end items-end">
        <StatusLegend />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {res.data.map((unit, index) => {
          return <UnitCard key={unit.id} unit={unit} index={index} />
        })}
      </div>
    </div>
  )
}

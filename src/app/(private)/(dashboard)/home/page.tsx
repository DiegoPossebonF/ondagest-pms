import UnitCard from '@/components/unit/UnitCard'
import db from '@/lib/db'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

export default async function Dashboard() {
  const units = await getUnits()

  if (!units) {
    return <div>Erro ao buscar unidades</div>
  }

  return (
    <>
      <main>
        <div className="text-lg mb-4">Acomodações</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {units.map(unit => {
            const today = dayjs().startOf('day')

            const hasActiveBookingToday = unit.bookings.find(booking => {
              const start = dayjs(booking.startDate).startOf('day')
              const end = dayjs(booking.endDate).startOf('day')

              return (
                (today.isSame(start, 'day') || today.isAfter(start, 'day')) &&
                (today.isSame(end, 'day') || today.isBefore(end, 'day'))
              )
            })

            return (
              <UnitCard
                key={unit.id}
                unit={unit}
                booking={hasActiveBookingToday}
              />
            )
          })}
        </div>
      </main>
    </>
  )
}

async function getUnits() {
  const units = await db.unit.findMany({
    include: {
      type: true,
      bookings: {
        include: {
          guest: true,
          unit: {
            include: {
              type: {
                include: {
                  rates: {
                    include: {
                      type: true,
                    },
                  },
                },
              },
            },
          },
          payments: true,
          services: true,
          discounts: true,
        },
      },
    },
  })

  if (!units) {
    throw new Error('Erro ao buscar Unidades')
  }
  return units
}

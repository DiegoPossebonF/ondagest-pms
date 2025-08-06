import { getUnits } from '@/app/actions/unit/actions'
import { UnitsList } from '@/components/unit/UnitsList'
import type { Prisma } from '@prisma/client'

export type UnitWithTypeAndBookings = Prisma.UnitGetPayload<{
  include: { type: true; bookings: true }
}>

export default async function UnitsPage() {
  const res = await getUnits()

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Acomodações</h1>
        <p className="text-muted-foreground">
          Aqui voce pode gerenciar todas as acomodações cadastradas na
          plataforma.
        </p>
      </div>
      <div className="flex flex-col">
        <UnitsList unitsData={res.data} />
      </div>
    </>
  )
}

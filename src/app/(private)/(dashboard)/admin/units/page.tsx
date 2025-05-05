import type { Prisma } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import { UnitSheet } from '@/components/unit/UnitSheet'
import UnitTable from '@/components/unit/UnitTable'

import { Plus } from 'lucide-react'

type UnitWithTypeAndBookings = Prisma.UnitGetPayload<{
  include: { type: true; bookings: true }
}>

export default async function UnitsPage() {
  const units: UnitWithTypeAndBookings[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/units`,
    {
      method: 'GET',
    }
  ).then(res => res.json())

  const unitType = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/unit-types`,
    {
      method: 'GET',
    }
  ).then(res => res.json())

  return (
    <main>
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>ACOMODAÇÕES</span>
        <UnitSheet unitsType={unitType}>
          <Button variant={'default'}>
            <Plus size={20} />
          </Button>
        </UnitSheet>
      </div>
      <div className="p-6">
        <UnitTable units={units} unitsType={unitType} />
      </div>
    </main>
  )
}

import type { Prisma } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import { UnitTypeSheet } from '@/components/unit-type/UnitTypeSheet'
import UnitTypeTable from '@/components/unit-type/UnitTypeTable'

import { Plus } from 'lucide-react'

type UnitTypeWithUnitsAndRates = Prisma.UnitTypeGetPayload<{
  include: { units: true; rates: true }
}>

export default async function UnitTypesPage() {
  const unitTypes: UnitTypeWithUnitsAndRates[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/unit-types`,
    {
      method: 'GET',
    }
  ).then(res => res.json())

  return (
    <main>
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>
          TIPOS DE ACOMODAÇÃO
        </span>
        <UnitTypeSheet>
          <Button variant={'default'}>
            <Plus size={20} />
          </Button>
        </UnitTypeSheet>
      </div>
      <div className="p-6">
        <UnitTypeTable unitTypes={unitTypes} />
      </div>
    </main>
  )
}

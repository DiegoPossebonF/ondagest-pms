import type { Prisma } from '@/app/generated/prisma'
import { UnitTypesList } from '@/components/unit-type/UnitTypesList'

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
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tipos de Unidade</h1>
        <p className="text-muted-foreground">
          Aqui voce pode gerenciar todos os tipos de unidades cadastrados na
          plataforma.
        </p>
      </div>
      <div className="flex flex-col">
        <UnitTypesList unitTypesData={unitTypes} />
      </div>
    </>
  )
}

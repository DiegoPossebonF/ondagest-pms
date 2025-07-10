import { getUnitTypes } from '@/app/actions/unitType/actions'
import { UnitTypesList } from '@/components/unit-type/UnitTypesList'

export default async function UnitTypesPage() {
  const res = await getUnitTypes()

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

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
        <UnitTypesList unitTypesData={res.data} />
      </div>
    </>
  )
}

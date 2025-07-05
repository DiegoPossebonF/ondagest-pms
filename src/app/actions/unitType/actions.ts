'use server'
import db from '@/lib/db'

export async function getUnitTypes() {
  try {
    const unitTypes = await db.unitType.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        units: true,
      },
    })
    return {
      success: 'Tipos de acomodações buscados com sucesso',
      unitTypes,
    }
  } catch (error) {
    console.log('Erro ao buscar tipos de acomodações', error)
    return { error: 'Erro ao buscar tipos de acomodações' }
  }
}

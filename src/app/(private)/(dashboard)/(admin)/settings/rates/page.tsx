import { RateSheet } from '@/components/rate/RateSheet'
import RateTable from '@/components/rate/RateTable'
import { Button } from '@/components/ui/button'
import type { Rate } from '@/types/rate'
import { Plus } from 'lucide-react'

export default async function UsersPage() {
  const rates: Rate[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rates`,
    {
      method: 'GET',
    }
  ).then(res => res.json())

  const unitTypes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/unit-types`,
    {
      method: 'GET',
    }
  ).then(res => res.json())

  return (
    <main>
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>TARIFAS</span>
        <RateSheet unitTypes={unitTypes}>
          <Button variant={'default'}>
            <Plus size={20} />
          </Button>
        </RateSheet>
      </div>
      <div className="p-6">
        <RateTable rates={rates} unitTypes={unitTypes} />
      </div>
    </main>
  )
}

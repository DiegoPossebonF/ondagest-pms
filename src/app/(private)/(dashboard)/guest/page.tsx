import { GuestList } from '@/components/guest/GuestList'
import { GuestSheet } from '@/components/guest/GuestSheet'
import { Button } from '@/components/ui/button'
import db from '@/lib/db'
import { Plus } from 'lucide-react'

export default async function GuestsPage() {
  const guests = await db.guest.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main>
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>
          LISTA DE HÓSPEDES
        </span>
        <GuestSheet>
          <Button variant={'default'}>
            <Plus size={20} />
          </Button>
        </GuestSheet>
      </div>
      <GuestList guests={guests} />
    </main>
  )
}

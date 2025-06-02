import { GuestList } from '@/components/guest/GuestList'
import db from '@/lib/db'

export default async function GuestsPage() {
  const guests = await db.guest.findMany({
    orderBy: { name: 'asc' },
  })

  return <GuestList guests={guests} />
}

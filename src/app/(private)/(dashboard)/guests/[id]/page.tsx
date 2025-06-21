import GuestForm from '@/components/guest/GuestForm'
import db from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function GuestId({ params }: { params: { id: string } }) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  const guest = await db.guest.findUnique({
    where: { id },
  })

  if (!guest) {
    notFound()
  }

  return (
    <div className="p-6 overflow-auto">
      <GuestForm guest={guest} />
    </div>
  )
}

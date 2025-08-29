import { getGuestById } from '@/app/actions/guest/actions'
import GuestForm from '@/components/guest/GuestForm'

export default async function GuestId({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const res = await getGuestById(id)

  if (res.error || !res.data) {
    throw new Error(res.error)
  }

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <div className="w-full md:w-1/2">
        <GuestForm guest={res.data} />
      </div>
    </div>
  )
}

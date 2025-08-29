import GuestForm from '@/components/guest/GuestForm'

export default async function NewGuestsPage() {
  return (
    <div className="flex flex-col justify-center items-center p-6">
      <div className="w-full md:w-1/2">
        <GuestForm />
      </div>
    </div>
  )
}

export default async function GuestId({ params }: { params: { id: string } }) {
  const { id } = await params

  return (
    <div className="p-6 overflow-auto">
      <p>{id}</p>
    </div>
  )
}

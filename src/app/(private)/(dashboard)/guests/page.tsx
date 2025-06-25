import { GuestsList } from '@/components/guest/GuestsList'

export default async function GuestsPage() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Hóspedes</h1>
        <p className="text-muted-foreground">
          Aqui você pode gerenciar todos os hóspedes cadastrados na plataforma.
        </p>
      </div>
      <div className="flex flex-col">
        <GuestsList />
      </div>
    </>
  )
}

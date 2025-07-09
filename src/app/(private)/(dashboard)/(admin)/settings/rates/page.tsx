import { RatesList } from '@/components/rate/RatesList'

export default async function RatesPage() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tarifas</h1>
        <p className="text-muted-foreground">
          Aqui voce pode gerenciar todas as tarifas cadastradas na plataforma.
        </p>
      </div>
      <div className="flex flex-col">
        <RatesList />
      </div>
    </>
  )
}

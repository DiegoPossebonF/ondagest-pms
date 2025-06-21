export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-semibold">Página não encontrada</h2>
      <p className="text-muted-foreground">
        A reserva que você procura não existe ou foi removida.
      </p>
    </div>
  )
}

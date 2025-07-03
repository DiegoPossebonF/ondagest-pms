import { UsersList } from '@/components/user/UsersList'

export default async function UsersPage() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Usuários</h1>
        <p className="text-muted-foreground">
          Aqui você pode gerenciar todos os usuários cadastrados na plataforma.
        </p>
      </div>
      <div className="flex flex-col">
        <UsersList />
      </div>
    </>
  )
}

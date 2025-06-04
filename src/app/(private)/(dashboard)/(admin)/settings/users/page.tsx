import { Button } from '@/components/ui/button'
import { UserList } from '@/components/user/UserList'
import { UserSheet } from '@/components/user/UserSheet'
import { Plus } from 'lucide-react'

export default async function UsersPage() {
  const users = await fetch('http://localhost:3000/api/users', {
    method: 'GET',
  }).then(res => res.json())

  return (
    <main>
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700 bg-blue-200">
        <span className={`font-semibold transition-opacity`}>USUÁRIOS</span>
        <UserSheet>
          <Button variant={'default'}>
            <Plus size={20} />
          </Button>
        </UserSheet>
      </div>
      <div className="p-6">
        <UserList users={users} />
      </div>
    </main>
  )
}

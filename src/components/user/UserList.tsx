'use client'
import type { User } from '@/app/generated/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserSheet } from './UserSheet'

interface UserListProps {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-4">
      {sortedUsers.map(user => (
        <UserSheet key={user.id} user={user}>
          <div className="flex items-center p-4 border rounded-lg hover:bg-blue-200 transition cursor-pointer shadow-md">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.image || ''} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>

            <div className="ml-4 flex-1">
              <p className="font-medium text-lg">{user.name}</p>
              <p className="text-md text-gray-500">{user.email}</p>
              {user.role === 'ADMIN' && (
                <p className="text-sm text-cyan-900 font-semibold">
                  Administrador
                </p>
              )}
              {user.role === 'USER' && (
                <p className="text-sm text-orange-400 font-semibold">Usuário</p>
              )}
            </div>
          </div>
        </UserSheet>
      ))}
    </div>
  )
}

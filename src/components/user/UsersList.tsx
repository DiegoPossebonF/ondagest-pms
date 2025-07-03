'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import dayjs from 'dayjs'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'
import UserForm from './UserForm'
import { UserListMobile } from './UserListMobile'
import {
  type SortKey,
  type UserData,
  useUsersFilters,
} from './UsersFiltersProvider'
import UsersListFooter from './UsersListFooter'
import UsersListHeader from './UsersListHeader'

export function UsersList() {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [openNewUser, setOpenNewUser] = useState(false)
  const { users, SortHeader } = useUsersFilters()

  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="space-y-4 mb-4">
        <div className="px-6">
          <UsersListHeader setOpenNewUser={setOpenNewUser} />
        </div>
        <UserListMobile setSelectedUser={setSelectedUser} />
        <div className="px-6">
          <UsersListFooter />
        </div>

        <Sheet
          open={!!selectedUser || openNewUser}
          onOpenChange={() => {
            setSelectedUser(null)
            setOpenNewUser(false)
          }}
        >
          <SheetContent side="right" className="sm:w-[450px] w-[80%]">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold mb-4">
                {'Editar usuário'}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground sr-only">
                {'Edite os dados do usuário'}
              </SheetDescription>
            </SheetHeader>
            <UserForm
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              setOpenNewUser={setOpenNewUser}
            />
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <UsersListHeader setOpenNewUser={setOpenNewUser} />
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-sidebar text-left h-12 p-2">
            <TableRow>
              {[
                { key: 'name', label: 'Nome' },
                { key: 'email', label: 'E-mail' },
                { key: 'role', label: 'Função' },
                { key: 'createdAt', label: 'Criado em' },
              ].map(col => (
                <TableHead
                  key={col.key}
                  className="min-w-[150px] text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  <div
                    className={`flex ${col.key === 'createdAt' ? 'justify-end' : ''}`}
                  >
                    <SortHeader label={col.label} column={col.key as SortKey} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-muted">
            {users.length > 0 ? (
              users.map(user => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <TableCell className="px-4 py-1 font-medium whitespace-nowrap">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right whitespace-nowrap">
                    {dayjs(user.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <UsersListFooter />

      <Sheet
        open={!!selectedUser || openNewUser}
        onOpenChange={() => {
          setSelectedUser(null)
          setOpenNewUser(false)
        }}
      >
        <SheetContent side="right" className="sm:w-[450px] w-[80%]">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold mb-4">
              {'Editar usuário'}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground sr-only">
              {'Edite os dados do usuário'}
            </SheetDescription>
          </SheetHeader>
          <UserForm
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setOpenNewUser={setOpenNewUser}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

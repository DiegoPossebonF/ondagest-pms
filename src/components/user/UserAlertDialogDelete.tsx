'use client'
import { deleteUser } from '@/app/actions/user/deleteUser'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { useUsersFilters } from './UsersFiltersProvider'

interface UserAlertDialogDeleteProps {
  userId: string
  name: string
  role: string
  setOpenNewUser: (open: boolean) => void
  setSelectedUser: () => void
}

export function UserAlertDialogDelete({
  userId,
  name,
  role,
  setOpenNewUser,
  setSelectedUser,
}: UserAlertDialogDeleteProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { refetch } = useUsersFilters()
  const router = useRouter()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-400" size={'sm'}>
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Excluir {role === 'ADMIN' ? 'administrador' : 'usuário'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o{' '}
            {role === 'ADMIN' ? 'administrador' : 'usuário'}{' '}
            <strong>{name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            size={'sm'}
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size={'sm'}
            onClick={() => {
              startTransition(async () => {
                const res = await deleteUser(userId, role)
                if (res.error) {
                  toast('Erro', { description: res.error, icon: '🚨' })
                  setOpen(false)
                } else {
                  toast('Sucesso', { description: res.success, icon: '✅' })
                  router.refresh()
                  refetch()
                  setOpen(false)
                  setOpenNewUser(false)
                  setSelectedUser()
                }
              })
            }}
            disabled={isPending}
          >
            Confirmar exclusão
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

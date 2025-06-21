'use client'
import { deleteGuest } from '@/app/actions/guest/deleteGuest'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type GuestDeleteAlertDialogProps = {
  guestId: string
}

export function GuestDeleteAlertDialog({
  guestId,
}: GuestDeleteAlertDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteGuest(guestId)

      if (result?.success) {
        toast.success(result.success)
        router.push('/guests')
        router.refresh()
      } else {
        toast.error(result?.error || 'Erro ao excluir hóspede')
      }
      setOpen(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Hóspede</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este hóspede? Obs: O hóspede não pode
            ter registros de reservas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Voltar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

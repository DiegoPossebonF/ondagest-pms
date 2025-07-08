'use client'
import type { RateWithUnitType } from '@/app/actions/rate/actions'
import { deleteRate } from '@/app/actions/rate/deleteRate'
import { Button } from '@/components/ui/button'
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

interface RateAlertDialogDeleteProps {
  rateId: string
  name: string
  setOpenNewRate: (open: boolean) => void
  setSelectedRate: (rate: RateWithUnitType | null) => void
}

export function RateAlertDialogDelete({
  rateId,
  name,
  setOpenNewRate,
  setSelectedRate,
}: RateAlertDialogDeleteProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-400" size={'sm'}>
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Tarifa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a tarifa <strong>{name}</strong>?
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
                const res = await deleteRate(rateId)
                if (res.error) {
                  toast('Erro', { description: res.error, icon: '🚨' })
                  setOpen(false)
                } else {
                  toast('Sucesso', { description: res.success, icon: '✅' })
                  setOpen(false)
                  setOpenNewRate(false)
                  setSelectedRate(null)
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

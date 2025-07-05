'use client'
import type { UnitWithTypeAndBookings } from '@/app/(private)/(dashboard)/(admin)/settings/units/page'
import { deleteUnit } from '@/app/actions/unit/deleteUnit'
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

interface UnitAlertDialogDeleteProps {
  unitId: string
  name: string
  setOpenNewUnit: (open: boolean) => void
  setSelectedUnit: (unitType: UnitWithTypeAndBookings | null) => void
}

export function UnitAlertDialogDelete({
  unitId,
  name,
  setOpenNewUnit,
  setSelectedUnit,
}: UnitAlertDialogDeleteProps) {
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
          <AlertDialogTitle>Excluir acomodação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a acomodação <strong>{name}</strong>?
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
                const res = await deleteUnit(unitId)
                if (res.error) {
                  toast('Erro', { description: res.error, icon: '🚨' })
                  setOpen(false)
                } else {
                  toast('Sucesso', { description: res.success, icon: '✅' })
                  setOpen(false)
                  setOpenNewUnit(false)
                  setSelectedUnit(null)
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

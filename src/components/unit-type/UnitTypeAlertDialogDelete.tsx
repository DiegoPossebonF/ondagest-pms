'use client'
import { deleteUnitType } from '@/app/actions/unitType/deleteUnitType'
import { Button } from '@/components/ui/button'
import type { UnitType } from '@prisma/client'
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

interface UnitTypeAlertDialogDeleteProps {
  unitTypeId: string
  name: string
  setOpenNewUnitType: (open: boolean) => void
  setSelectedUnitType: (unitType: UnitType | null) => void
}

export function UnitTypeAlertDialogDelete({
  unitTypeId,
  name,
  setOpenNewUnitType,
  setSelectedUnitType,
}: UnitTypeAlertDialogDeleteProps) {
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
          <AlertDialogTitle>Excluir tipo de acomodação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o tipo de acomodação{' '}
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
                const res = await deleteUnitType(unitTypeId)
                if (res.error) {
                  toast('Erro', { description: res.error, icon: '🚨' })
                  setOpen(false)
                } else {
                  toast('Sucesso', { description: res.success, icon: '✅' })
                  setOpen(false)
                  setOpenNewUnitType(false)
                  setSelectedUnitType(null)
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

'use client'
import { deleteService } from '@/app/actions/service/deleteService'
import type { Service } from '@/app/generated/prisma'
import { formatCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'
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
import { Button } from '../ui/button'

interface ServiceAlertDialogDeleteProps {
  children?: React.ReactNode
  service: Service
  open: boolean
  setOpen: (open: boolean) => void
  closeSheet?: (open: boolean) => void
}

export function ServiceAlertDialogDelete({
  children,
  service,
  open,
  setOpen,
  closeSheet,
}: ServiceAlertDialogDeleteProps) {
  const router = useRouter()

  const handleDelete = async (service: Service) => {
    const result = await deleteService(service.id)

    if (!result.success) {
      toast('Erro ao excluir', {
        description: result.msg,
      })
    } else {
      toast('Excluído', {
        description: result.msg,
      })
      router.refresh()
    }
    setOpen(false)
    if (closeSheet) {
      closeSheet(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja deletar este serviço?
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Deletar
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button
          key={service.id}
          variant="outline"
          size={'sm'}
          className="w-full justify-between"
        >
          <span>{service.name}</span>
          <span>{formatCurrency(service.amount)}</span>
        </Button>
        <AlertDialogFooter>
          <Button variant="outline" size={'sm'} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size={'sm'}
            onClick={() => handleDelete(service)}
          >
            Confirmar exclusão
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

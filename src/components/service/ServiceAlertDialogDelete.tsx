'use client'
import { deleteService } from '@/app/actions/service/deleteService'
import type { Service } from '@/app/generated/prisma'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { ServiceItemList } from './ServiceItemList'

interface ServiceAlertDialogDeleteProps {
  children?: React.ReactNode
  service: Service
  open: boolean
  setOpen: (open: boolean) => void
}

export function ServiceAlertDialogDelete({
  children,
  service,
  open,
  setOpen,
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
        description: 'Pagamento removido com sucesso',
      })
      router.refresh()
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
        <ServiceItemList service={service} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(service)}>
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

'use client'
import { deleteService } from '@/app/actions/service/deleteService'
import type { Service } from '@/app/generated/prisma'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
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
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (service: Service) => {
    const result = await deleteService(service.id)

    if (!result.success) {
      toast({
        title: 'Erro ao excluir',
        description: result.msg,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Excluído',
        description: 'Pagamento removido com sucesso',
        variant: 'success',
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

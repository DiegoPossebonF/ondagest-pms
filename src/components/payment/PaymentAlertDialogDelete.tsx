'use client'
import { deletePayment } from '@/app/actions/payment/deletePayment'
import type { Payment } from '@/app/generated/prisma'
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
import { PaymentItemList } from './PaymentItemList'

interface PaymentAlertDialogDeleteProps {
  children?: React.ReactNode
  payment: Payment
  open: boolean
  setOpen: (open: boolean) => void
}

export function PaymentAlertDialogDelete({
  children,
  payment,
  open,
  setOpen,
}: PaymentAlertDialogDeleteProps) {
  const router = useRouter()

  const handleDelete = async (payment: Payment) => {
    const result = await deletePayment(payment.id)

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
            Tem certeza que deseja deletar este pagamento?
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Deletar
          </AlertDialogDescription>
        </AlertDialogHeader>
        <PaymentItemList payment={payment} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(payment)}>
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

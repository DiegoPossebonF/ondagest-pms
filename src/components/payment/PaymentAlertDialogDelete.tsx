'use client'
import { deletePayment } from '@/app/actions/payment/deletePayment'
import type { Payment } from '@/app/generated/prisma'
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
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (payment: Payment) => {
    const result = await deletePayment(payment.id)

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
            Tem certeza que deseja deletar este pagamento?
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Deletar
          </AlertDialogDescription>
        </AlertDialogHeader>
        <PaymentItemList
          payment={payment}
          classname={payment ? 'bg-orange-200' : 'bg-white'}
        />
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

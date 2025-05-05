import { deletePayment } from '@/actions/payment/deletePayment'
import type { Payment } from '@/app/generated/prisma'
import { useToast } from '@/hooks/use-toast'
import { PAYMENT_TYPE_LABELS, formatCurrency } from '@/lib/utils'
import dayjs from 'dayjs'
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
} from '../ui/alert-dialog'
import { Badge } from '../ui/badge'

interface PaymentAlertDialogDeleteProps {
  payment: Payment
  bookingId?: number
  open: boolean
  setOpen: (open: boolean) => void
  setPayment: (payment: Payment | null) => void
}

export function PaymentAlertDialogDelete({
  payment,
  open,
  setOpen,
  setPayment,
}: PaymentAlertDialogDeleteProps) {
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (payment: Payment) => {
    const result = await deletePayment(payment)

    if (result?.error) {
      toast({
        title: 'Erro ao excluir',
        description: result.error,
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja deletar este pagamento?
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Deletar
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div
          className={`flex justify-between items-center border rounded-lg p-2 px-3 shadow-sm bg-white`}
        >
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{formatCurrency(payment.amount)}</p>
            <div className="flex gap-1">
              <Badge className="font-mono text-[10px] text-blue-300">
                {dayjs(payment.paidAt).format('DD/MM/YYYY')}
              </Badge>
              <Badge
                className="font-mono text-[10px] text-blue-300"
                title={PAYMENT_TYPE_LABELS[payment.paymentType]}
              >
                {PAYMENT_TYPE_LABELS[payment.paymentType]}
              </Badge>
            </div>
          </div>
        </div>
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

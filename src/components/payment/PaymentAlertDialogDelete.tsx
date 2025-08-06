'use client'
import { deletePayment } from '@/app/actions/payment/deletePayment'
import {
  PAYMENT_TYPE_ICONS,
  PAYMENT_TYPE_LABELS,
  formatCurrency,
} from '@/lib/utils'
import type { Payment } from '@prisma/client'
import { IconCalendarCheck } from '@tabler/icons-react'
import dayjs from 'dayjs'
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

interface PaymentAlertDialogDeleteProps {
  children?: React.ReactNode
  payment: Payment
  open: boolean
  setOpen: (open: boolean) => void
  closeSheet?: (open: boolean) => void
}

export function PaymentAlertDialogDelete({
  children,
  payment,
  open,
  setOpen,
  closeSheet,
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
    setOpen(false)
    if (closeSheet) {
      closeSheet(false)
    }
  }

  const Icon = PAYMENT_TYPE_ICONS[payment.paymentType]

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
        <Button
          key={payment.id}
          variant="outline"
          size={'sm'}
          className="w-full justify-between"
        >
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <IconCalendarCheck className="w-4 h-4" />
              {dayjs(payment.paidAt).format('DD/MM/YYYY')}
            </div>
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {PAYMENT_TYPE_LABELS[payment.paymentType]}
            </div>
          </div>
          <span className="font-semibold">
            {formatCurrency(payment.amount)}
          </span>
        </Button>
        <AlertDialogFooter>
          <Button variant="outline" size={'sm'} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size={'sm'}
            onClick={() => handleDelete(payment)}
          >
            Confirmar exclusão
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

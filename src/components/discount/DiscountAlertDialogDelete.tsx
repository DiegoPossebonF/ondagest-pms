'use client'
import { deleteDiscount } from '@/app/actions/discount/deleteDiscount'
import type { Discount } from '@/app/generated/prisma'
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

interface DiscountAlertDialogDeleteProps {
  children?: React.ReactNode
  discount: Discount
  open: boolean
  setOpen: (open: boolean) => void
  closeSheet?: (open: boolean) => void
}

export function DiscountAlertDialogDelete({
  children,
  discount,
  open,
  setOpen,
  closeSheet,
}: DiscountAlertDialogDeleteProps) {
  const router = useRouter()

  const handleDelete = async (discount: Discount) => {
    const result = await deleteDiscount(discount.id)

    if (!result.success) {
      toast('Erro ao excluir', {
        description: result.msg,
      })
    } else {
      toast('Excluído', {
        description: 'Desconto removido com sucesso',
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
            Tem certeza que deseja deletar este desconto?
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Deletar
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button
          key={discount.id}
          variant="outline"
          size={'sm'}
          className="w-full justify-between"
        >
          <span>{discount.reason}</span>
          <span>- R$ {discount.amount.toFixed(2)}</span>
        </Button>
        <AlertDialogFooter>
          <Button variant="outline" size={'sm'} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size={'sm'}
            onClick={() => handleDelete(discount)}
          >
            Confirmar exclusão
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

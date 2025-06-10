'use client'
import { deleteDiscount } from '@/app/actions/discount/deleteDiscount'
import type { Discount } from '@/app/generated/prisma'
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
import { DiscountItemList } from './DiscountItemList'

interface DiscountAlertDialogDeleteProps {
  children?: React.ReactNode
  discount: Discount
  open: boolean
  setOpen: (open: boolean) => void
}

export function DiscountAlertDialogDelete({
  children,
  discount,
  open,
  setOpen,
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
        description: result.msg,
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
            Tem certeza que deseja deletar este desconto?
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Deletar
          </AlertDialogDescription>
        </AlertDialogHeader>
        <DiscountItemList discount={discount} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(discount)}>
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

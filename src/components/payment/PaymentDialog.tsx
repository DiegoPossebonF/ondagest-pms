import type { Payment } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { BookingAllIncludes } from '@/types/booking'
import Link from 'next/link'
import type { Dispatch, SetStateAction } from 'react'
import { PaymentForm } from './PaymentForm'

interface PaymentDialogProps {
  dialogOpen: boolean
  sheetOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  booking: BookingAllIncludes
  payment?: Payment
}

export function PaymentDialog({
  dialogOpen,
  sheetOpen,
  setDialogOpen,
  booking,
  payment,
}: PaymentDialogProps) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={!sheetOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Novo pagamento</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {payment ? 'Editar pagamento' : 'Novo pagamento'}
          </DialogTitle>
          <DialogDescription>
            <Link href={`/booking/${booking?.id}`}>
              {`RES:${String(booking?.id).padStart(6, '0')} - ${booking?.unit.name} - ${booking?.unit.type.name}`}
            </Link>
          </DialogDescription>
        </DialogHeader>
        <PaymentForm
          booking={booking}
          payment={payment}
          onClose={() => {
            setDialogOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { cancelBooking } from '@/app/actions/booking/cancelBooking'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type CancelBookingAlertDialogProps = {
  bookingId: number
}

export function BookingCancelAlertDialog({
  bookingId,
}: CancelBookingAlertDialogProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'CANCELLED' | 'NO_SHOW'>('CANCELLED')
  const [isPending, startTransition] = useTransition()

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelBooking(bookingId, status)

      if (result.success) {
        toast.success(result.success)
      } else {
        toast.error(result?.error || 'Erro ao cancelar reserva')
      }
      setOpen(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Cancelar reserva
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar reserva</AlertDialogTitle>
          <AlertDialogDescription>
            Escolha o motivo do cancelamento. Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <Label>Tipo de cancelamento</Label>
          <RadioGroup
            value={status}
            onValueChange={value => setStatus(value as 'CANCELLED' | 'NO_SHOW')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CANCELLED" id="cancelled" />
              <Label htmlFor="cancelled">Cancelamento comum</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NO_SHOW" id="no_show" />
              <Label htmlFor="no_show">Não comparecimento (No-Show)</Label>
            </div>
          </RadioGroup>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Voltar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
          >
            {isPending ? 'Cancelando...' : 'Confirmar cancelamento'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

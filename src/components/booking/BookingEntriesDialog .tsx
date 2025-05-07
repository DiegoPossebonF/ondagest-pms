'use client'
import type { Discount, Payment, Service } from '@/app/generated/prisma'
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
import { useState } from 'react'
import { DiscountForm } from '../discount/DiscountForm'
import { PaymentForm } from '../payment/PaymentForm'
import { ServiceForm } from '../service/ServiceForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

type BookingEntriesDialogProps = {
  children?: React.ReactNode
  booking: BookingAllIncludes
  payment?: Payment
  service?: Service
  discount?: Discount
  open?: boolean
  setOpen?: (open: boolean) => void
}

export function BookingEntriesDialog({
  children,
  booking,
  payment,
  service,
  discount,
  open,
  setOpen,
}: BookingEntriesDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  //const [payment, setPayment] = useState<Payment>()
  //const [service, setService] = useState<Service>()
  //const [discount, setDiscount] = useState<Discount>()

  return (
    <Dialog
      open={open ? open : dialogOpen}
      onOpenChange={setOpen ? setOpen : setDialogOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{'Lançar pagamentos, Serviços e Descontos'}</DialogTitle>
          <DialogDescription>
            <Link href={`/booking/${booking?.id}`}>
              {`RES:${String(booking?.id).padStart(6, '0')} - ${booking?.unit.name} - ${booking?.unit.type.name}`}
            </Link>
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue={service ? 'service' : discount ? 'discount' : 'payment'}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="service">Serviço</TabsTrigger>
            <TabsTrigger value="discount">Desconto</TabsTrigger>
          </TabsList>
          <TabsContent value="payment">
            <PaymentForm booking={booking} payment={payment} />
          </TabsContent>
          <TabsContent value="service">
            <ServiceForm
              booking={booking}
              service={service}
              setDialogOpen={setDialogOpen}
            />
          </TabsContent>
          <TabsContent value="discount">
            <DiscountForm booking={booking} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

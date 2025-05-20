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
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
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
  setOpen?: Dispatch<SetStateAction<boolean>>
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
  const [selectedForm, setSelectedForm] = useState('')

  //const [payment, setPayment] = useState<Payment>()
  //const [service, setService] = useState<Service>()
  //const [discount, setDiscount] = useState<Discount>()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (payment) {
      setSelectedForm('payment')
    } else if (service) {
      setSelectedForm('service')
    } else if (discount) {
      setSelectedForm('discount')
    }
  }, [payment, service, discount, selectedForm])

  const isCreate = !payment && !service && !discount
  console.log('isCreate', isCreate)

  return (
    <Dialog
      open={open ? open : dialogOpen}
      onOpenChange={setOpen ? setOpen : setDialogOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {service && selectedForm === 'service'
              ? 'Editar'
              : discount && selectedForm === 'discount'
                ? 'Editar'
                : payment && selectedForm === 'payment'
                  ? 'Editar'
                  : 'Lançar'}
          </DialogTitle>
          <DialogDescription>
            <Link href={`/booking/${booking?.id}`}>
              {`RES:${String(booking?.id).padStart(6, '0')} - ${booking?.unit.name} - ${booking?.unit.type.name}`}
            </Link>
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue={selectedForm}
          className="w-full"
          onValueChange={value => {
            setSelectedForm(value)
          }}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="payment"
              disabled={selectedForm !== 'payment' && !isCreate}
            >
              Pagamento
            </TabsTrigger>
            <TabsTrigger
              value="service"
              disabled={selectedForm !== 'service' && !isCreate}
            >
              Serviço
            </TabsTrigger>
            <TabsTrigger
              value="discount"
              disabled={selectedForm !== 'discount' && !isCreate}
            >
              Desconto
            </TabsTrigger>
          </TabsList>
          <TabsContent value="payment" className="flex flex-col gap-2">
            <PaymentForm
              booking={booking}
              payment={payment}
              openDialog={setOpen ? setOpen : setDialogOpen}
            />
          </TabsContent>
          <TabsContent value="service">
            <ServiceForm
              booking={booking}
              service={service}
              setDialogOpen={setOpen ? setOpen : setDialogOpen}
            />
          </TabsContent>
          <TabsContent value="discount">
            <DiscountForm
              booking={booking}
              discount={discount}
              openDialog={setOpen ? setOpen : setDialogOpen}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

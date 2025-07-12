'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import type { Discount, Payment, Service } from '@/app/generated/prisma'
import {
  PAYMENT_TYPE_ICONS,
  PAYMENT_TYPE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_PAYMENT_COLORS,
  STATUS_PAYMENT_LABELS,
  cn,
  formatCurrency,
} from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import {
  IconCalendarCheck,
  IconCashRegister,
  IconHome,
  IconMoneybagMinus,
  IconTax,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { BookingActionsSheet } from './BookingActionsSheet'

dayjs.locale('pt-br')

interface BookingDetailsProps {
  booking: BookingAllIncludes
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const [editAction, setEditAction] = useState<
    'payment' | 'discount' | 'service' | null
  >(null)
  const [editObject, setEditObject] = useState<
    Payment | Discount | Service | null
  >(null)
  const [openSheet, setOpenSheet] = useState(false)

  const {
    guest,
    unit,
    rate,
    payments,
    services,
    discounts,
    startDate,
    endDate,
    numberOfPeople,
    pricingMode,
    daily,
    totalAmount,
    paymentStatus,
    status,
  } = booking

  const days = dayjs(endDate).diff(dayjs(startDate), 'day')

  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0)
  const totalServices = services.reduce((acc, s) => acc + s.amount, 0)
  const totalDiscounts = discounts.reduce((acc, d) => acc + d.amount, 0)
  const totalExpected = (daily ?? 0) * days + totalServices - totalDiscounts

  // useEffect para quando fechar o sheet, limpar o objeto editado
  useEffect(() => {
    if (!openSheet) {
      setEditObject(null)
      setEditAction(null)
    }
  }, [openSheet])

  if (!daily) {
    return (
      <Card className="flex flex-col w-full h-full bg-sidebar dark:bg-muted">
        <CardHeader className="space-y-2 pb-2">
          <CardTitle className="flex flex-row items-center">
            Detalhes da Reserva #{booking.id}
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant="default"
              className={cn('capitalize', STATUS_COLORS[status])}
            >
              Status: {STATUS_LABELS[status]}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4">
          Conferir o modo de cálculo do preço. Diária nula. Entre em contato com
          o suporte.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col w-full h-full bg-sidebar dark:bg-muted">
      <CardHeader className="space-y-2">
        <CardTitle className="flex flex-row items-center">
          Detalhes da Reserva #{booking.id}
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col justify-around h-full overflow-auto space-y-4">
        <div className="flex gap-2 flex-wrap pt-6">
          <Badge
            variant="default"
            className={cn('capitalize', STATUS_COLORS[status])}
          >
            Status: {STATUS_LABELS[status]}
          </Badge>
          <Badge
            variant="default"
            className={cn('capitalize', STATUS_PAYMENT_COLORS[paymentStatus])}
          >
            Pagamento: {STATUS_PAYMENT_LABELS[paymentStatus]}
          </Badge>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full space-y-2"
          defaultValue="guest"
        >
          {/* Hóspede */}
          <AccordionItem
            value="guest"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="flex items-center justify-between w-full cursor-pointer py-2 px-4 bg-background shadow-sm transition-colors font-semibold text-sm">
              <div className="flex items-center gap-4">
                <IconUser className="h-4 w-4" /> Hóspede
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 bg-background" asChild>
              <div key="guest" className="overflow-hidden p-4">
                <div className="grid gap-2">
                  <span>
                    <strong>Nome:</strong> {guest.name}
                  </span>
                  <span>
                    <strong>Email:</strong> {guest.email}
                  </span>
                  <span>
                    <strong>CPF:</strong> {guest.cpf}
                  </span>
                  <span>
                    <strong>Telefone:</strong> {guest.phone ?? '-'}
                  </span>
                  <span>
                    <strong>Cidade:</strong> {guest.city ?? '-'}
                  </span>
                  <span>
                    <strong>Placa do carro:</strong> {guest.carPlate ?? '-'}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Acomodação */}
          <AccordionItem
            value="unit"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="flex items-center justify-between w-full cursor-pointer py-2 px-4 bg-background shadow-sm transition-colors font-semibold text-sm">
              <div className="flex items-center gap-4">
                <IconHome className="h-4 w-4" /> Acomodação
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 bg-background" asChild>
              <div key="unit" className="overflow-hidden p-4">
                <div className="grid gap-2">
                  <span>
                    <strong>Nome:</strong> {unit.name}
                  </span>
                  <span>
                    <strong>Tipo:</strong> {unit.type.name}
                  </span>
                  <span>
                    <strong>Nº pessoas permitido:</strong>{' '}
                    {unit.type.numberOfPeople}
                  </span>
                  <span>
                    <strong>Data de Entrada:</strong>{' '}
                    {dayjs(startDate).format('DD/MM/YYYY')}
                  </span>
                  <span>
                    <strong>Data de Saída:</strong>{' '}
                    {dayjs(endDate).format('DD/MM/YYYY')}
                  </span>
                  <span>
                    <strong>Qtd. Diárias:</strong> {days}
                  </span>
                  <span>
                    <strong>Qtd. Pessoas:</strong> {numberOfPeople}
                  </span>
                  <span>
                    <strong>Modo de Preço:</strong>{' '}
                    {pricingMode === 'MANUAL' ? 'Manual' : 'Tarifa'}
                  </span>
                  <span>
                    <strong>Valor da diária:</strong> R$ {formatCurrency(daily)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Pagamentos */}
          <AccordionItem
            value="payments"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="flex items-center justify-between w-full cursor-pointer py-2 px-4 bg-background shadow-sm transition-colors font-semibold text-sm">
              <div className="flex items-center gap-4">
                <IconCashRegister className="h-4 w-4" />
                Pagamentos ({payments.length})
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 bg-background" asChild>
              <div key="payments" className="overflow-hidden p-4">
                {payments.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Nenhum pagamento registrado.
                  </span>
                )}
                <div className="space-y-2">
                  {payments.map(p => {
                    const Icon = PAYMENT_TYPE_ICONS[p.paymentType]
                    return (
                      <Button
                        key={p.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => {
                          setEditAction('payment')
                          setEditObject(p)
                          setOpenSheet(true)
                        }}
                      >
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <IconCalendarCheck className="w-4 h-4" />
                            {dayjs(p.paidAt).format('DD/MM/YYYY')}
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {PAYMENT_TYPE_LABELS[p.paymentType]}
                          </div>
                        </div>
                        <span className="font-semibold">
                          {formatCurrency(p.amount)}
                        </span>
                      </Button>
                    )
                  })}
                  <div className="text-right font-bold mt-2">
                    Total pago: R$ {totalPaid.toFixed(2)}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Descontos */}
          <AccordionItem
            value="discounts"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="flex items-center justify-between w-full cursor-pointer py-2 px-4 bg-background shadow-sm transition-colors font-semibold text-sm">
              <div className="flex items-center gap-4">
                <IconMoneybagMinus className="h-4 w-4" /> Descontos (
                {discounts.length})
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 bg-background" asChild>
              <div key="discounts" className="overflow-hidden p-4">
                {discounts.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Nenhum desconto aplicado.
                  </span>
                )}
                <div className="space-y-2">
                  {discounts.map(d => (
                    <Button
                      key={d.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => {
                        setEditAction('discount')
                        setEditObject(d)
                        setOpenSheet(true)
                      }}
                    >
                      <span>{d.reason}</span>
                      <span>- R$ {d.amount.toFixed(2)}</span>
                    </Button>
                  ))}
                  <div className="text-right font-bold mt-2">
                    Total descontos: - R$ {totalDiscounts.toFixed(2)}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Serviços */}
          <AccordionItem
            value="services"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="flex items-center justify-between w-full cursor-pointer py-2 px-4 bg-background shadow-sm transition-colors font-semibold text-sm">
              <div className="flex items-center gap-4">
                <IconTool className="h-4 w-4" /> Serviços ({services.length})
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 bg-background" asChild>
              <div key="services" className="overflow-hidden p-4">
                {services.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Nenhum serviço lançado.
                  </span>
                )}
                <div className="space-y-2">
                  {services.map(s => (
                    <Button
                      key={s.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => {
                        setEditAction('service')
                        setEditObject(s)
                        setOpenSheet(true)
                      }}
                    >
                      <span>{s.name}</span>
                      <span>R$ {formatCurrency(s.amount)}</span>
                    </Button>
                  ))}
                  <div className="text-right font-bold mt-2">
                    Total serviços: {totalServices.toFixed(2)}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Resumo Financeiro */}
          <AccordionItem
            value="summary"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="flex items-center justify-between w-full cursor-pointer py-2 px-4 bg-background shadow-sm transition-colors font-semibold text-sm">
              <div className="flex items-center gap-4">
                <IconTax className="h-4 w-4" /> Resumo Financeiro
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 bg-background" asChild>
              <div key="summary" className="overflow-hidden p-4">
                <div className="grid gap-2">
                  <span>
                    <strong>Total da reserva:</strong> R${' '}
                    {totalExpected.toFixed(2)}
                  </span>
                  <span>
                    <strong>Total pago:</strong> R$ {totalPaid.toFixed(2)}
                  </span>
                  <span>
                    <strong>Saldo restante:</strong> R${' '}
                    {(totalExpected - totalPaid).toFixed(2)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-end px-6 py-4">
        <BookingActionsSheet
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
          booking={booking}
          editAction={editAction ? editAction : undefined}
          editObject={editObject ? editObject : undefined}
        />
      </CardFooter>
    </Card>
  )
}

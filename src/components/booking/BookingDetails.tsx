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
import 'dayjs/locale/pt-br'
import dayjs from '@/lib/dayjs'
import {
  PAYMENT_TYPE_ICONS,
  PAYMENT_TYPE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_PAYMENT_COLORS,
  STATUS_PAYMENT_COLORS_TEXT,
  STATUS_PAYMENT_LABELS,
  cn,
  formatCurrency,
  padNumber,
} from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import type { Discount, Payment, Service } from '@prisma/client'
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
import VoucherViewer from '../pdf/VoucherViewer'
import { Table, TableBody, TableCell, TableRow } from '../ui/table'
import { BookingActionsSheet } from './BookingActionsSheet'

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

  const days = dayjs(endDate).utc().diff(dayjs(startDate), 'day')

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
            Detalhes da Reserva #{booking?.id && padNumber(booking?.id)}
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
          Detalhes da Reserva #{booking?.id && padNumber(booking?.id)}
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col h-full overflow-auto space-y-4">
        <Card className="flex flex-row justify-between gap-4 text-sm p-4 mt-4">
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
        </Card>

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
              <div key="guest" className="overflow-hidden">
                <Table className="w-full text-xs">
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold pl-4">Nome</TableCell>
                      <TableCell className="text-right pr-4">
                        {guest.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">Email</TableCell>
                      <TableCell className="text-right pr-4">
                        {guest.email}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">CPF</TableCell>
                      <TableCell className="text-right pr-4">
                        {guest.cpf}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">Telefone</TableCell>
                      <TableCell className="text-right pr-4">
                        {guest.phone ?? '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">Cidade</TableCell>
                      <TableCell className="text-right pr-4">
                        {guest.city ?? '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Placa do carro
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {guest.carPlate ?? '-'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
              <div key="unit" className="overflow-hidden">
                <Table className="w-full text-xs">
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold pl-4">Nome</TableCell>
                      <TableCell className="text-right pr-4">
                        {unit.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">Tipo</TableCell>
                      <TableCell className="text-right pr-4">
                        {unit.type.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Acomoda até
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {unit.type.numberOfPeople} pessoas
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Data de Entrada
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {dayjs(startDate).utc().format('DD/MM/YYYY')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Data de Saída
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {dayjs(endDate).utc().format('DD/MM/YYYY')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">Diárias</TableCell>
                      <TableCell className="text-right pr-4">{days}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Nº Pessoas
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {numberOfPeople}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Modo de Preço
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {pricingMode === 'MANUAL' ? 'Manual' : 'Tarifa'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Valor da diária
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {formatCurrency(daily)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
              <div key="payments" className="overflow-hidden">
                {payments.length === 0 && (
                  <div className="text-sm text-muted-foreground p-4">
                    Nenhum pagamento registrado.
                  </div>
                )}
                <div className="space-y-2">
                  <Table className="w-full text-xs">
                    <TableBody>
                      {payments.map(p => {
                        const Icon = PAYMENT_TYPE_ICONS[p.paymentType]
                        return (
                          <TableRow
                            key={p.id}
                            className="cursor-pointer"
                            onClick={() => {
                              setEditAction('payment')
                              setEditObject(p)
                              setOpenSheet(true)
                            }}
                          >
                            <TableCell className=" pl-4">
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
                            </TableCell>
                            <TableCell className="text-right pr-4">
                              {formatCurrency(p.amount)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow>
                        <TableCell className="font-bold pl-4">
                          Total pago
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          {formatCurrency(totalPaid)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
              <div key="discounts" className="overflow-hidden">
                {discounts.length === 0 && (
                  <div className="text-sm text-muted-foreground p-4">
                    Nenhum desconto aplicado.
                  </div>
                )}
                <div className="space-y-2">
                  <Table className="w-full text-xs">
                    <TableBody>
                      {discounts.map(d => {
                        return (
                          <TableRow
                            key={d.id}
                            className="cursor-pointer"
                            onClick={() => {
                              setEditAction('discount')
                              setEditObject(d)
                              setOpenSheet(true)
                            }}
                          >
                            <TableCell className="pl-4">
                              <span>{d.reason}</span>
                            </TableCell>
                            <TableCell className="text-right pr-4">
                              - {formatCurrency(d.amount)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow>
                        <TableCell className="font-bold pl-4">
                          Total descontos
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          - {formatCurrency(totalDiscounts)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
              <div key="services" className="overflow-hidden">
                {services.length === 0 && (
                  <div className="text-sm text-muted-foreground p-4">
                    Nenhum serviço lançado.
                  </div>
                )}
                <div className="space-y-2">
                  <Table className="w-full text-xs">
                    <TableBody>
                      {services.map(s => {
                        return (
                          <TableRow
                            key={s.id}
                            className="cursor-pointer"
                            onClick={() => {
                              setEditAction('service')
                              setEditObject(s)
                              setOpenSheet(true)
                            }}
                          >
                            <TableCell className="pl-4">
                              <span>{s.name}</span>
                            </TableCell>
                            <TableCell className="text-right pr-4">
                              {formatCurrency(s.amount)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow>
                        <TableCell className="font-bold pl-4">
                          Total descontos
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          {formatCurrency(totalServices)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
              <div key="summary" className="overflow-hidden">
                <Table className="w-full text-xs">
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Hospedagem
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {`${days} dia(s) x ${formatCurrency(daily)} = ${formatCurrency(days * daily)}`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Serviços extras
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {`+ ${formatCurrency(totalServices)}`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Descontos
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {`- ${formatCurrency(totalDiscounts)}`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Total da reserva
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {formatCurrency(totalExpected)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Total pago
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {formatCurrency(totalPaid)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">
                        Saldo restante
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {formatCurrency(totalExpected - totalPaid)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold pl-4">Status</TableCell>
                      <TableCell
                        className={`font-bold text-right pr-4 ${STATUS_PAYMENT_COLORS_TEXT[booking.paymentStatus]}`}
                      >
                        {booking.paymentStatus === 'COMPLETED'
                          ? 'Pago'
                          : 'Pendente'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-center px-6 py-4 gap-2">
        <BookingActionsSheet
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
          booking={booking}
          editAction={editAction ? editAction : undefined}
          editObject={editObject ? editObject : undefined}
        />
        <VoucherViewer booking={booking} />
      </CardFooter>
    </Card>
  )
}

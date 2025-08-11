'use client'

import { getPaymentsList } from '@/app/actions/payment/getPaymentsList'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { padNumber } from '@/lib/utils'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'

type PaymentListProps = {
  from: Date
  to: Date
}

type Payment = {
  id: string
  date: string
  guest: string
  unit: string
  amount: number
  method: string
  bookingId: number | null
}

export function PaymentList({ from, to }: PaymentListProps) {
  const [data, setData] = useState<Payment[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [sortField, setSortField] = useState<'paidAt' | 'amount' | 'guestName'>(
    'paidAt'
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const loadPayments = () => {
      try {
        startTransition(async () => {
          const res = await getPaymentsList({
            from,
            to,
            page,
            limit: 10,
            sortField,
            sortDirection,
          })
          setData(res.data)
          setTotalPages(res.totalPages)
        })
      } catch (error) {
        console.error(error)
        setData([])
        setTotalPages(1)
      }
    }

    loadPayments()
  }, [from, to, page, sortField, sortDirection])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setPage(1)
  }, [from, to])

  const toggleSort = (field: 'paidAt' | 'amount' | 'guestName') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <Card className="flex flex-col w-full h-full min-h-[545.2px] shadow-md rounded-lg">
      {/* Sempre no topo */}
      <CardHeader>
        <CardTitle>Pagamentos no período</CardTitle>
      </CardHeader>

      {/* Ocupa o espaço do meio */}
      <CardContent className="flex-1">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº da Reserva</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => toggleSort('paidAt')}
                >
                  Data{' '}
                  {isPending && sortField === 'paidAt' ? (
                    <LoadingSpinner size="sm" className="inline justify-end" />
                  ) : (
                    sortField === 'paidAt' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUp className="inline h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="inline h-3 w-3 ml-1" />
                    ))
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => toggleSort('guestName')}
                >
                  Hóspede{' '}
                  {isPending && sortField === 'guestName' ? (
                    <LoadingSpinner size="sm" className="inline justify-end" />
                  ) : (
                    sortField === 'guestName' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUp className="inline h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="inline h-3 w-3 ml-1" />
                    ))
                  )}
                </TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Método</TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => toggleSort('amount')}
                >
                  Valor (R$){' '}
                  {isPending && sortField === 'amount' ? (
                    <LoadingSpinner size="sm" className="inline justify-end" />
                  ) : (
                    sortField === 'amount' &&
                    (sortDirection === 'asc' ? (
                      <ArrowUp className="inline h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDown className="inline h-3 w-3 ml-1" />
                    ))
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-sm text-muted-foreground"
                  >
                    {isPending && <LoadingSpinner />}
                    {!isPending && 'Nenhum pagamento encontrado'}
                  </TableCell>
                </TableRow>
              ) : (
                data.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link href={`/bookings/${p.bookingId}`}>
                        #{p.bookingId ? padNumber(p.bookingId) : '-'}
                      </Link>
                    </TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell>{p.guest}</TableCell>
                    <TableCell>{p.unit}</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell className="text-right">
                      {p.amount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Sempre no rodapé */}
      <CardFooter className="flex w-full items-center justify-between mt-auto">
        {totalPages > 1 && (
          <div className="flex items-end justify-between w-full">
            <div className="text-xs text-muted-foreground">
              Página {page} de {totalPages || 1}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

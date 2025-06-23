'use client'

import { getGuests } from '@/app/actions/guest/actions'
import type { Guest } from '@/app/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import dayjs from 'dayjs'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { GuestFiltersProps } from './GuestsFilters'

export function GuestsList() {
  const router = useRouter()

  const [guests, setGuests] = useState<Guest[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)

  const [activeFilters, setActiveFilters] = useState(false)
  const [filters, setFilters] = useState<GuestFiltersProps>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    city: '',
    carPlate: '',
    startDate: null,
    endDate: null,
  })
  const [orderBy, setOrderBy] = useState<keyof Guest>('createdAt')
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc')
  const perPage = 10

  useEffect(() => {
    const fetchData = async () => {
      const result = await getGuests({
        page,
        perPage,
        orderBy,
        direction,
        filters,
      })

      setGuests(result.data)
      setTotalPages(result.totalPages)
    }

    fetchData()
  }, [page, orderBy, direction, filters])

  const handleFilterChange = (
    key: keyof GuestFiltersProps,
    value: string | Date | null
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
    setActiveFilters(true)
  }

  const handleSort = (column: keyof Guest) => {
    if (orderBy === column) {
      setDirection(direction === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderBy(column)
      setDirection('asc')
    }
  }

  const SortHeader = ({
    label,
    column,
  }: { label: string; column: keyof Guest }) => (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1"
      onClick={() => handleSort(column)}
    >
      {label}
      {orderBy === column &&
        (direction === 'asc' ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        ))}
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-muted text-left">
            <TableRow>
              {[
                { key: 'name', label: 'Nome' },
                { key: 'email', label: 'E-mail' },
                { key: 'phone', label: 'Telefone' },
                { key: 'cpf', label: 'CPF' },
                { key: 'carPlate', label: 'Placa' },
                { key: 'city', label: 'Cidade' },
                { key: 'createdAt', label: 'Cadastro' },
              ].map(col => (
                <TableHead
                  key={col.key}
                  className="min-w-[150px] text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  <SortHeader
                    label={col.label}
                    column={col.key as keyof Guest}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {guests.length > 0 ? (
              guests.map(guest => (
                <TableRow
                  key={guest.id}
                  onClick={() => {
                    router.push(`/guests/${guest.id}`)
                  }}
                  className="cursor-pointer"
                >
                  <TableCell className="px-4 py-1 font-medium">
                    {guest.name}
                  </TableCell>
                  <TableCell className="px-4 py-2">{guest.email}</TableCell>
                  <TableCell className="px-4 py-2">{guest.phone}</TableCell>
                  <TableCell className="px-4 py-2">{guest.cpf}</TableCell>
                  <TableCell className="px-4 py-2">
                    {guest.carPlate || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-2">{guest.city}</TableCell>
                  <TableCell className="px-4 py-2">
                    {dayjs(guest.createdAt).format('DD/MM/YYYY')}
                  </TableCell>

                  {/* <TableCell className="px-4 py-1 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Visualizar</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhum hóspede encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { GuestsListMobile } from './GuestListMobile'
import { type SortKey, useGuestsFilters } from './GuestsFiltersProvider'
import GuestsListFooter from './GuestsListFooter'
import GuestsListHeader from './GuestsListHeader'

export function GuestsList() {
  const router = useRouter()
  const { guests, SortHeader } = useGuestsFilters()

  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="space-y-4 mb-4">
        <GuestsListMobile />
        <GuestsListFooter />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <GuestsListHeader />
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
                  <SortHeader label={col.label} column={col.key as SortKey} />
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
      <GuestsListFooter />
    </div>
  )
}

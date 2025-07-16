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
import AlertErrorGlobal from '../AlertErrorGlobal'
import { useOrganization } from '../organization/OrganizationProvider'
import { GuestsListMobile } from './GuestListMobile'
import { type SortKey, useGuestsFilters } from './GuestsFiltersProvider'
import GuestsListFooter from './GuestsListFooter'
import GuestsListHeader from './GuestsListHeader'

export function GuestsList() {
  const router = useRouter()
  const { guests, error, SortHeader } = useGuestsFilters()
  const org = useOrganization()

  const isMobile = useIsMobile()

  if (error) return <AlertErrorGlobal message={error} />

  if (isMobile) {
    return (
      <div className="space-y-4 mb-4">
        <div className="px-6">
          <GuestsListHeader />
        </div>
        <GuestsListMobile />
        <div className="px-6">
          <GuestsListFooter />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <GuestsListHeader />
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-sidebar text-left h-12 p-2">
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
                  <div
                    className={`flex ${col.key === 'createdAt' ? 'justify-end' : ''}`}
                  >
                    <SortHeader label={col.label} column={col.key as SortKey} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-muted">
            {guests.length > 0 ? (
              guests.map(guest => (
                <TableRow
                  key={guest.id}
                  onClick={() => {
                    router.push(`/guests/${guest.id}`)
                  }}
                  className="cursor-pointer"
                >
                  <TableCell className="px-4 py-1 font-medium whitespace-nowrap">
                    {guest.name}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {guest.email}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {guest.phone}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {guest.cpf}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {guest.carPlate || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {guest.city}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right whitespace-nowrap">
                    {dayjs(guest.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
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

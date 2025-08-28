'use client'
import type { RateWithUnitType } from '@/app/actions/rate/actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { formatCurrency } from '@/lib/utils'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useState } from 'react'
import AlertErrorGlobal from '../AlertErrorGlobal'
import { LoadingSpinner } from '../LoadingSpinner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'
import RateForm from './RateForm'
import { type SortKey, useRatesFilters } from './RatesFiltersProvider'
import RatesListFooter from './RatesListFooter'
import RatesListHeader from './RatesListHeader'
import { RatesListMobile } from './RatesListMobile'

export function RatesList() {
  const [openNewRate, setOpenNewRate] = useState(false)
  const [selectedRate, setSelectedRate] = useState<RateWithUnitType | null>(
    null
  )
  const { rates, error, SortHeader, isPending } = useRatesFilters()

  const isMobile = useIsMobile()

  if (error) return <AlertErrorGlobal message={error} />

  if (isMobile) {
    return (
      <div className="space-y-4 mb-4">
        <div className="px-6">
          <RatesListHeader setOpenNewRate={setOpenNewRate} />
        </div>
        <RatesListMobile setSelectedRate={setSelectedRate} />
        <div className="px-6">
          <RatesListFooter />
        </div>

        <Sheet
          open={!!selectedRate || openNewRate}
          onOpenChange={() => {
            setSelectedRate(null)
            setOpenNewRate(false)
          }}
        >
          <SheetContent side="right" className="sm:w-[450px] w-[80%]">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold mb-4">
                {selectedRate ? 'Editar tarifa' : 'Nova tarifa'}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground sr-only">
                {selectedRate ? 'Editar tarifa' : 'Nova tarifa'}
              </SheetDescription>
            </SheetHeader>
            <RateForm
              selectedRate={selectedRate}
              setOpenNewRate={setOpenNewRate}
              setSelectedRate={setSelectedRate}
            />
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <RatesListHeader setOpenNewRate={setOpenNewRate} />
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-sidebar text-left h-12 p-2">
            <TableRow>
              {[
                { key: 'name', label: 'Nome' },
                { key: 'type', label: 'Tipo' },
                { key: 'value', label: 'Valor' },
                { key: 'numberOfPeople', label: 'Nº de Pessoas' },
                { key: 'active', label: 'Ativa' },
                { key: 'createdAt', label: 'Criado em' },
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
            {isPending ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : rates.length > 0 ? (
              rates.map(rate => (
                <TableRow
                  key={rate.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedRate(rate)}
                >
                  <TableCell className="px-4 py-1 font-medium whitespace-nowrap">
                    {rate.name}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {rate.type.name}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {formatCurrency(rate.value)}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {rate.numberOfPeople}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {rate.active ? (
                      <IconEye className="w-4 h-4 text-green-600" />
                    ) : (
                      <IconEyeOff className="w-4 h-4 text-red-400" />
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right whitespace-nowrap">
                    {dayjs(rate.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  {isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Nenhuma tarifa localizada.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <RatesListFooter />

      <Sheet
        open={!!selectedRate || openNewRate}
        onOpenChange={() => {
          setSelectedRate(null)
          setOpenNewRate(false)
        }}
      >
        <SheetContent side="right" className="sm:w-[450px] w-[80%]">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold mb-4">
              {selectedRate ? 'Editar tarifa' : 'Nova tarifa'}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground sr-only">
              {selectedRate ? 'Editar tarifa' : 'Nova tarifa'}
            </SheetDescription>
          </SheetHeader>
          <RateForm
            selectedRate={selectedRate}
            setOpenNewRate={setOpenNewRate}
            setSelectedRate={setSelectedRate}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

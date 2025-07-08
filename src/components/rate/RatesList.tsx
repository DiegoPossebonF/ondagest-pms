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
import { IconEye, IconEyeOff, IconHome } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ButtonTooltip } from '../ButtonTooltip'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'
import RateForm from './RateForm'

export type SortKey = 'name' | 'type' | 'value' | 'numberOfPeople' | 'createdAt'

export function RatesList({ ratesData }: { ratesData: RateWithUnitType[] }) {
  const [rates, setRates] = useState<RateWithUnitType[]>(ratesData)
  const [selectedRate, setSelectedRate] = useState<RateWithUnitType | null>(
    null
  )
  const [openNewRAte, setOpenNewRate] = useState(false)

  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const sorted = ratesData.sort((a, b) => {
      if (sortKey === 'type') {
        if (a[sortKey].name < b[sortKey].name)
          return sortDirection === 'asc' ? -1 : 1
        if (a[sortKey].name > b[sortKey].name)
          return sortDirection === 'asc' ? 1 : -1
        return 0
      }

      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setRates(sorted)
  }, [sortKey, sortDirection, ratesData])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const SortHeader = ({
    label,
    column,
  }: { label: string; column: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 text-foreground"
      onClick={() => handleSort(column)}
    >
      {label}
      {sortKey === column &&
        (sortDirection === 'asc' ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        ))}
    </Button>
  )

  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="space-y-4 mb-4">
        <div className="flex flex-row justify-between gap-2 px-6">
          <ButtonTooltip
            icon={<IconHome className="w-4 h-4" />}
            tooltipText="Nova Tarifa"
            tooltipSide="top"
            className="self-start"
            onClick={() => setOpenNewRate(true)}
          />
        </div>
        {/*<UnitListMobile
          units={units}
          SortHeader={SortHeader}
          setSelectedUnit={setSelectedUnit}
        /> */}

        <Sheet
          open={!!selectedRate || openNewRAte}
          onOpenChange={() => {
            setSelectedRate(null)
            setOpenNewRate(false)
          }}
        >
          <SheetContent side="right" className="sm:w-[450px] w-[80%]">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold mb-4">
                {'Editar tipo de unidade'}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground sr-only">
                {'Edite o tipo de unidade'}
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
      <div className="flex flex-row justify-between gap-2">
        <ButtonTooltip
          icon={<IconHome className="w-4 h-4" />}
          tooltipText="Nova Tarifa"
          tooltipSide="top"
          className="self-start"
          onClick={() => setOpenNewRate(true)}
        />
      </div>
      {/* <UsersListHeader setOpenNewUser={setOpenNewUser} /> */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-sidebar text-left h-12 p-2">
            <TableRow>
              {[
                { key: 'name', label: 'Nome' },
                { key: 'type', label: 'Tipo' },
                { key: 'value', label: 'Valor' },
                { key: 'numberOfPeople', label: 'Nº de Pessoas' },
                { key: 'active', label: 'Ativo' },
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
            {rates.length > 0 ? (
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
                <TableCell colSpan={5} className="text-center py-6">
                  Nenhuma tarifa localizada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet
        open={!!selectedRate || openNewRAte}
        onOpenChange={() => {
          setSelectedRate(null)
          setOpenNewRate(false)
        }}
      >
        <SheetContent side="right" className="sm:w-[450px] w-[80%]">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold mb-4">
              {'Editar tipo de unidade'}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground sr-only">
              {'Edite o tipo de unidade'}
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

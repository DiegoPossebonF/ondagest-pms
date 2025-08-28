'use client'
import type { UnitWithTypeAndBookings } from '@/app/(private)/(dashboard)/(admin)/settings/units/page'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import dayjs from '@/lib/dayjs'
import { IconHomePlus } from '@tabler/icons-react'
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
import UnitForm from './UnitForm'
import { UnitListMobile } from './UnitListMobile'

export type SortKey = 'name' | 'type' | 'createdAt'

export function UnitsList({
  unitsData,
}: { unitsData: UnitWithTypeAndBookings[] }) {
  const [units, setUnits] = useState<UnitWithTypeAndBookings[]>(unitsData)
  const [selectedUnit, setSelectedUnit] =
    useState<UnitWithTypeAndBookings | null>(null)
  const [openNewUnit, setOpenNewUnit] = useState(false)

  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const sorted = unitsData.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setUnits(sorted)
  }, [sortKey, sortDirection, unitsData])

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
            icon={<IconHomePlus className="w-4 h-4" />}
            tooltipText="Nova acomodação"
            tooltipSide="top"
            className="self-start"
            onClick={() => setOpenNewUnit(true)}
          />
        </div>
        <UnitListMobile
          units={units}
          SortHeader={SortHeader}
          setSelectedUnit={setSelectedUnit}
        />

        <Sheet
          open={!!selectedUnit || openNewUnit}
          onOpenChange={() => {
            setSelectedUnit(null)
            setOpenNewUnit(false)
          }}
        >
          <SheetContent side="right" className="sm:w-[450px] w-[80%]">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold mb-4">
                {selectedUnit ? 'Editar acomodação' : 'Nova acomodação'}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground sr-only">
                {selectedUnit ? 'Editar acomodação' : 'Nova acomodação'}
              </SheetDescription>
            </SheetHeader>
            <UnitForm
              selectedUnit={selectedUnit}
              setOpenNewUnit={setOpenNewUnit}
              setSelectedUnit={setSelectedUnit}
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
          icon={<IconHomePlus className="w-4 h-4" />}
          tooltipText="Nova acomodação"
          tooltipSide="top"
          className="self-start"
          onClick={() => setOpenNewUnit(true)}
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
                { key: 'description', label: 'Descrição' },
                { key: 'numberOfPeople', label: 'Nº de Pessoas' },
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
            {units.length > 0 ? (
              units.map(unit => (
                <TableRow
                  key={unit.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedUnit(unit)}
                >
                  <TableCell className="px-4 py-1 font-medium whitespace-nowrap">
                    {unit.name}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {unit.type.name}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {unit.type.description}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {unit.type.numberOfPeople}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right whitespace-nowrap">
                    {dayjs(unit.createdAt).utc().format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Nenhuma acomodacão cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet
        open={!!selectedUnit || openNewUnit}
        onOpenChange={() => {
          setSelectedUnit(null)
          setOpenNewUnit(false)
        }}
      >
        <SheetContent side="right" className="sm:w-[450px] w-[80%]">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold mb-4">
              {selectedUnit ? 'Editar acomodação' : 'Cadastrar acomodação'}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground sr-only">
              {selectedUnit ? 'Editar acomodação' : 'Cadastrar acomodação'}
            </SheetDescription>
          </SheetHeader>
          <UnitForm
            selectedUnit={selectedUnit}
            setOpenNewUnit={setOpenNewUnit}
            setSelectedUnit={setSelectedUnit}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

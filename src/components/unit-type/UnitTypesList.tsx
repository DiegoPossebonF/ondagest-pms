'use client'
import type { UnitType } from '@/app/generated/prisma'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { IconHomeCog } from '@tabler/icons-react'
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
import UnitTypeForm from './UnitTypeForm'
import { UnitTypesListMobile } from './UnitTypesListMobile'

export type SortKey =
  | 'name'
  | 'description'
  | 'numberOfPeople'
  | 'createdAt'
  | 'updatedAt'

export function UnitTypesList({
  unitTypesData,
}: { unitTypesData: UnitType[] }) {
  const [unitTypes, setUnitTypes] = useState<UnitType[]>(unitTypesData)
  const [selectedUnitType, setSelectedUnitType] = useState<UnitType | null>(
    null
  )
  const [openNewUnitType, setOpenNewUnitType] = useState(false)

  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const sorted = unitTypesData.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setUnitTypes(sorted)
  }, [sortKey, sortDirection, unitTypesData])

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
            icon={<IconHomeCog className="w-4 h-4" />}
            tooltipText="Novo Tipo de Unidade"
            tooltipSide="top"
            className="self-start"
            onClick={() => setOpenNewUnitType(true)}
          />
        </div>
        <UnitTypesListMobile
          unitTypes={unitTypes}
          SortHeader={SortHeader}
          setSelectedUnitType={setSelectedUnitType}
        />

        <Sheet
          open={!!selectedUnitType || openNewUnitType}
          onOpenChange={() => {
            setSelectedUnitType(null)
            setOpenNewUnitType(false)
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
            <UnitTypeForm
              selectedUnitType={selectedUnitType}
              setOpenNewUnitType={setOpenNewUnitType}
              setSelectedUnitType={setSelectedUnitType}
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
          icon={<IconHomeCog className="w-4 h-4" />}
          tooltipText="Novo Tipo de Unidade"
          tooltipSide="top"
          className="self-start"
          onClick={() => setOpenNewUnitType(true)}
        />
      </div>
      {/* <UsersListHeader setOpenNewUser={setOpenNewUser} /> */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-sidebar text-left h-12 p-2">
            <TableRow>
              {[
                { key: 'name', label: 'Nome' },
                { key: 'description', label: 'Descrição' },
                { key: 'numberOfPeople', label: 'Nº de pessoas' },
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
            {unitTypes.length > 0 ? (
              unitTypes.map(type => (
                <TableRow
                  key={type.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedUnitType(type)}
                >
                  <TableCell className="px-4 py-1 font-medium whitespace-nowrap">
                    {type.name}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {type.description}
                  </TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap">
                    {type.numberOfPeople}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right whitespace-nowrap">
                    {dayjs(type.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhum tipo de unidade encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet
        open={!!selectedUnitType || openNewUnitType}
        onOpenChange={() => {
          setSelectedUnitType(null)
          setOpenNewUnitType(false)
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
          <UnitTypeForm
            selectedUnitType={selectedUnitType}
            setOpenNewUnitType={setOpenNewUnitType}
            setSelectedUnitType={setSelectedUnitType}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

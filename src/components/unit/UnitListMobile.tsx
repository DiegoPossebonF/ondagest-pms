import type { UnitWithTypeAndBookings } from '@/app/(private)/(dashboard)/(admin)/settings/units/page'
import dayjs from '@/lib/dayjs'
import type { JSX } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import type { SortKey } from './UnitsList'

interface UnitListMobileProps {
  units: UnitWithTypeAndBookings[]
  SortHeader: ({
    label,
    column,
  }: {
    label: string
    column: SortKey
  }) => JSX.Element
  setSelectedUnit: (unit: UnitWithTypeAndBookings | null) => void
}

export function UnitListMobile({
  units,
  SortHeader,
  setSelectedUnit,
}: UnitListMobileProps) {
  return (
    <div className="border overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader className="bg-sidebar dark:bg-background text-left">
          <TableRow>
            <TableHead className="flex flex-row items-center justify-between h-12 p-2">
              <div className="flex flex-row items-center gap-2">
                <SortHeader label="Nome" column="name" />
                <SortHeader label="Tipo" column="type" />
              </div>

              <SortHeader label="Criado em" column="createdAt" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-muted">
          {units.map(unit => (
            <TableRow key={unit.id} className="border-0">
              <TableCell className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem
                    value={unit.id}
                    className="border-0 text-muted-foreground"
                  >
                    <AccordionTrigger className="no-underline hover:no-underline bg-sidebar dark:bg-background p-3 pr-2">
                      <div className="flex flex-row items-center justify-between w-full pr-4 pl-2 text-xs font-normal">
                        <div className="flex flex-row items-center gap-4">
                          <span className="font-semibold w-12">
                            {unit.name || 'N/A'}
                          </span>
                          <span className="font-semibold">
                            {unit.type.name || 'N/A'}
                          </span>
                        </div>

                        <span>
                          {dayjs(unit.createdAt).utc().format('DD/MM/YYYY') ||
                            'N/A'}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t pb-0 text-xs">
                      <div className="flex flex-row overflow-hidden border-b">
                        <div className="min-w-[100px] flex flex-col border-r bg-sidebar dark:bg-background">
                          <p className="text-right border-b p-2 font-semibold">
                            Descrição
                          </p>
                          <p className="text-right border-b p-2 font-semibold">
                            Nº de Pessoas
                          </p>
                        </div>
                        <div className="w-full flex flex-col">
                          <p className="text-right border-b p-2">
                            {unit.type.name || 'N/A'}
                          </p>
                          <p className="text-right border-b p-2">
                            {unit.type.description || 'N/A'}
                          </p>
                          <p className="text-right border-b p-2">
                            {unit.type.numberOfPeople || 'N/A'}
                          </p>
                          <div className="flex flex-row overflow-hidden">
                            <Button
                              className="w-full rounded-none"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUnit(unit)
                              }}
                            >
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

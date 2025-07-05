import type { UnitType } from '@/app/generated/prisma'
import dayjs from 'dayjs'
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
import type { SortKey } from './UnitTypesList'

interface UnitTypesListMobileProps {
  unitTypes: UnitType[]
  SortHeader: ({
    label,
    column,
  }: {
    label: string
    column: SortKey
  }) => JSX.Element
  setSelectedUnitType: (unitType: UnitType | null) => void
}

export function UnitTypesListMobile({
  unitTypes,
  SortHeader,
  setSelectedUnitType,
}: UnitTypesListMobileProps) {
  return (
    <div className="border overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader className="bg-sidebar dark:bg-background text-left">
          <TableRow>
            <TableHead className="flex flex-row items-center justify-between h-12 p-2">
              <SortHeader label="Nome" column="name" />
              <SortHeader label="Criado em" column="createdAt" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-muted">
          {unitTypes.map(type => (
            <TableRow key={type.id} className="border-0">
              <TableCell className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem
                    value={type.id}
                    className="border-0 text-muted-foreground"
                  >
                    <AccordionTrigger className="no-underline hover:no-underline bg-sidebar dark:bg-background p-3 pr-2">
                      <div className="flex flex-row items-center justify-between w-full pr-4 pl-2 text-xs font-normal">
                        <span className="font-semibold">
                          {type.name || 'N/A'}
                        </span>
                        <span>
                          {dayjs(type.createdAt).format('DD/MM/YYYY') || 'N/A'}
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
                            Nº de pessoas
                          </p>
                        </div>
                        <div className="w-full flex flex-col">
                          <p className="text-right border-b p-2">
                            {type.description || 'N/A'}
                          </p>
                          <p className="text-right border-b p-2">
                            {type.numberOfPeople || 'N/A'}
                          </p>
                          <div className="flex flex-row overflow-hidden">
                            <Button
                              className="w-full rounded-none"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUnitType(type)
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

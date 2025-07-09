import type { RateWithUnitType } from '@/app/actions/rate/actions'
import { formatCurrency } from '@/lib/utils'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
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
import { useRatesFilters } from './RatesFiltersProvider'

export function RatesListMobile({
  setSelectedRate,
}: { setSelectedRate: (rate: RateWithUnitType | null) => void }) {
  const router = useRouter()
  const { rates, SortHeader } = useRatesFilters()
  return (
    <div className="border overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader className="bg-sidebar dark:bg-background text-left">
          <TableRow>
            <TableHead className="flex flex-row items-center justify-between h-12 p-2">
              <div className="flex flex-row items-center justify-end gap-2">
                <div className="min-w-20 flex flex-row justify-start font-semibold">
                  <SortHeader label="Nome" column="name" />
                </div>

                <SortHeader label="Tipo" column="typeId" />
              </div>

              <div className="flex flex-row items-center justify-end gap-2 pr-4">
                <SortHeader label="Nº Pessoas" column="numberOfPeople" />
                <SortHeader label="Ativa" column="active" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-muted">
          {rates.map(rate => (
            <TableRow key={rate.id} className="border-0">
              <TableCell className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem
                    value={rate.id}
                    className="border-0 text-muted-foreground"
                  >
                    <AccordionTrigger className="no-underline hover:no-underline bg-sidebar dark:bg-background p-3 pr-2">
                      <div className="flex flex-row items-center justify-between w-full pr-2 pl-2 text-xs font-normal">
                        <div className="flex flex-row items-center justify-end gap-2">
                          <span className="min-w-20 flex flex-row justify-start font-semibold">
                            {rate.name || 'N/A'}
                          </span>
                          <span className="font-semibold">
                            {rate.type.name || 'N/A'}
                          </span>
                        </div>

                        <div className="flex flex-row items-center justify-end gap-2">
                          <div className="w-16 flex flex-row justify-start">
                            {rate.numberOfPeople || 'N/A'}
                          </div>
                          <div className="w-12 flex flex-row justify-center">
                            {rate.active ? (
                              <IconEye className="w-4 h-4 text-green-600" />
                            ) : (
                              <IconEyeOff className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t pb-0 text-xs">
                      <div className="flex flex-row overflow-hidden border-b">
                        <div className="min-w-[100px] flex flex-col border-r bg-sidebar dark:bg-background">
                          <p className="text-right border-b p-2 font-semibold">
                            Tipo
                          </p>
                          <p className="text-right border-b p-2 font-semibold">
                            Valor
                          </p>
                          <p className="text-right border-b p-2 font-semibold">
                            Ativa
                          </p>
                        </div>
                        <div className="w-full flex flex-col">
                          <p className="text-right border-b p-2">
                            {rate.type.name || 'N/A'}
                          </p>
                          <p className="text-right border-b p-2">
                            {formatCurrency(rate.value) || 'N/A'}
                          </p>
                          <p className="text-right border-b p-2">
                            {rate.active ? 'Sim' : 'Nao'}
                          </p>
                          <div className="flex flex-row overflow-hidden">
                            <Button
                              className="w-full rounded-none"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRate(rate)
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

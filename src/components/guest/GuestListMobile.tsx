import { IconBrandWhatsappFilled } from '@tabler/icons-react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '../LoadingSpinner'
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
import { useGuestsFilters } from './GuestsFiltersProvider'

export function GuestsListMobile() {
  const router = useRouter()
  const { guests, SortHeader, isPending } = useGuestsFilters()
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
          {isPending ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-6">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : guests.length > 0 ? (
            guests.map(guest => (
              <TableRow key={guest.id} className="border-0">
                <TableCell className="p-0">
                  <Accordion type="single" collapsible>
                    <AccordionItem
                      value={guest.id}
                      className="border-0 text-muted-foreground"
                    >
                      <AccordionTrigger className="no-underline hover:no-underline bg-sidebar dark:bg-background p-3 pr-2">
                        <div className="flex flex-row items-center justify-between w-full pr-4 pl-2 text-xs font-normal">
                          <span className="font-semibold">
                            {guest.name || 'N/A'}
                          </span>
                          <span>
                            {dayjs(guest.createdAt).format('DD/MM/YYYY') ||
                              'N/A'}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border-t pb-0 text-xs">
                        <div className="flex flex-row overflow-hidden border-b">
                          <div className="min-w-[100px] flex flex-col border-r bg-sidebar dark:bg-background">
                            <p className="text-right border-b p-2 font-semibold">
                              E-mail
                            </p>
                            <p className="text-right border-b p-2 font-semibold">
                              CPF
                            </p>
                            <p className="text-right border-b p-2 font-semibold">
                              Telefone
                            </p>
                            <p className="text-right border-b p-2 font-semibold">
                              Cidade
                            </p>
                            <p className="text-right border-b p-2 font-semibold">
                              Placa
                            </p>
                          </div>
                          <div className="w-full flex flex-col">
                            <p className="text-right border-b p-2">
                              {guest.email || 'N/A'}
                            </p>
                            <p className="text-right border-b p-2">
                              {guest.cpf || 'N/A'}
                            </p>
                            <div className="flex gap-4 justify-end text-right border-b p-2">
                              <Link
                                href={`https://wa.me/${guest.phone ? guest.phone.replace(/\D/g, '') : ''} `}
                                target="_blank"
                              >
                                <IconBrandWhatsappFilled
                                  className={`w-4 h-4 hover:text-green-500`}
                                />
                                <span className="sr-only">
                                  Conversar no Whatsapp
                                </span>
                              </Link>
                              {guest.phone || 'N/A'}
                            </div>
                            <div className="text-right border-b p-2">
                              {guest.city || 'N/A'}
                            </div>
                            <div className="text-right border-b p-2">
                              {guest.carPlate || 'N/A'}
                            </div>
                            <div className="flex flex-row overflow-hidden">
                              <Button
                                className="w-full rounded-none"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  router.push(`/guests/${guest.id}`)
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-6">
                {isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Nenhum hóspede encontrado'
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

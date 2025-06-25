import { IconBrandWhatsappFilled } from '@tabler/icons-react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { useGuestsFilters } from './GuestsFiltersProvider'
import GuestsListHeader from './GuestsListHeader'

export function GuestsListMobile() {
  const router = useRouter()
  const { guests } = useGuestsFilters()
  return (
    <div className="border overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader className="bg-muted dark:bg-background text-left">
          <TableRow>
            <TableHead className="p-4">
              <GuestsListHeader />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-muted">
          {guests.map(guest => (
            <TableRow key={guest.id}>
              <TableCell className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem value={guest.id} className="border-0">
                    <AccordionTrigger className="no-underline hover:no-underline bg-muted dark:bg-background pr-2">
                      <div className="flex flex-row items-center justify-between w-full px-4">
                        <span className="font-medium">
                          {guest.name || 'N/A'}
                        </span>
                        <span className="font-thin text-muted-foreground text-sm">
                          {guest.phone || 'N/A'}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t pb-0">
                      <div className="flex flex-row overflow-hidden text-xs">
                        <div className="min-w-[100px] flex flex-col border-r bg-muted dark:bg-background">
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
                          <p className="text-right p-2 font-semibold">
                            Criado em
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
                          <p className="text-right p-2">
                            {guest.createdAt
                              ? dayjs(guest.createdAt).format('DD/MM/YYYY')
                              : 'N/A'}
                          </p>
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

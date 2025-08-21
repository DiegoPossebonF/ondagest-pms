'use client'
import { shareReceipt } from '@/app/actions/utils/sharePDF'
import { useAppContext } from '@/contexts/AppContext'
import type { BookingAllIncludes } from '@/types/booking'
import type { Payment } from '@prisma/client'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { IconBrandWhatsapp, IconReceipt } from '@tabler/icons-react'
import { padStart } from 'lodash'
import { LoadingSpinner } from '../LoadingSpinner'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { SheetTrigger } from '../ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import ReceiptDocument from './ReceiptDocument'

export default function ReceiptViewer({
  booking,
  payment,
}: { booking: BookingAllIncludes; payment: Payment }) {
  const { organization } = useAppContext()

  if (!organization)
    throw new Error(
      'Organização não localizada. Tente novamente mais tarde ou contate o suporte.'
    )

  const isMobile =
    typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                size="sm"
                className={`w-fullsize-8 group-data-[collapsible=icon]:opacity-0`}
                variant="default"
                title="Gerar Recibo"
              >
                <IconReceipt className="h-4 w-4" />
                <span>Gerar Recibo</span>
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gerar Recibo</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className={`flex flex-col ${isMobile ? '' : 'h-[90vh]'}`}>
        <DialogHeader>
          <DialogTitle>
            Recibo da Reserva #{padStart(booking.id.toString(), 5, '0')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Recibo da Reserva {booking.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 h-full">
          <div className="flex flex-col items-center justify-center border rounded shadow h-full">
            {!isMobile ? (
              <PDFViewer
                width="98%"
                height="98%"
                style={{ borderRadius: '0.25rem' }}
              >
                <ReceiptDocument
                  booking={booking}
                  payment={payment}
                  organization={organization}
                />
              </PDFViewer>
            ) : (
              <div className="space-y-2 p-4">
                <p className="text-muted-foreground text-center">
                  Pré visualização do recibo indisponível em dispositivos
                  móveis.
                </p>
                <p className="text-muted-foreground text-center">
                  Para visualizar o recibo, clique no botão &quot;Baixar Voucher
                  PDF&quot; abaixo.
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter
          className={`flex flex-col  ${isMobile ? 'gap-4' : 'gap-2'}`}
        >
          <Button variant="outline" size="sm">
            <PDFDownloadLink
              document={
                <ReceiptDocument
                  booking={booking}
                  payment={payment}
                  organization={organization}
                />
              }
              fileName={`recibo-pagamento-reserva-nr-${padStart(booking.id.toString(), 5, '0')}.pdf`}
              className="w-full text-xs"
            >
              {({ loading }) =>
                loading ? <LoadingSpinner size="sm" /> : 'Baixar Recibo PDF'
              }
            </PDFDownloadLink>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const whatsappLink = await shareReceipt(
                payment.id,
                organization.sharingMessageReceipt || '',
                booking.guest.phone || ''
              )

              window.open(whatsappLink, '_blank')
            }}
          >
            <IconBrandWhatsapp className="h-4 w-4" />
            Compartilhar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

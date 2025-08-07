'use client'
import { shareVoucher } from '@/app/actions/utils/sharePDF'
import type { BookingAllIncludes } from '@/types/booking'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { IconBrandWhatsapp, IconFileLike } from '@tabler/icons-react'
import { padStart } from 'lodash'
import { LoadingSpinner } from '../LoadingSpinner'
import { useOrganization } from '../organization/OrganizationProvider'
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
import VoucherDocument from './VoucherDocument'

export default function VoucherViewer({
  booking,
}: { booking: BookingAllIncludes }) {
  const { logoBase64, organization } = useOrganization()

  const isMobile =
    typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className={`size-8 group-data-[collapsible=icon]:opacity-0`}
                variant="default"
                title="Gerar voucher"
              >
                <IconFileLike className="h-4 w-4" />
                <span className="sr-only">Gerar voucher</span>
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gerar voucher</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className={`flex flex-col ${isMobile ? '' : 'h-[90vh]'}`}>
        <DialogHeader>
          <DialogTitle>
            Voucher da Reserva #{padStart(booking.id.toString(), 5, '0')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Voucher da Reserva {booking.id}
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
                <VoucherDocument
                  booking={booking}
                  organization={{ ...organization, logoUrl: logoBase64 }}
                />
              </PDFViewer>
            ) : (
              <div className="space-y-2 p-4">
                <p className="text-muted-foreground text-center">
                  Pré visualização do voucher indisponível em dispositivos
                  móveis.
                </p>
                <p className="text-muted-foreground text-center">
                  Para visualizar o voucher, clique no botão &quot;Baixar
                  Voucher PDF&quot; abaixo.
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
                <VoucherDocument
                  booking={booking}
                  organization={{ ...organization, logoUrl: logoBase64 }}
                />
              }
              fileName={`voucher-reserva-nr-${padStart(booking.id.toString(), 5, '0')}.pdf`}
              className="w-full text-xs"
            >
              {({ loading }) =>
                loading ? <LoadingSpinner size="sm" /> : 'Baixar Voucher PDF'
              }
            </PDFDownloadLink>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const whatsappLink = await shareVoucher(
                booking.publicId,
                organization.invoiceMessageVoucher || '',
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

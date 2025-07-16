'use client'
import type { BookingAllIncludes } from '@/types/booking'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { IconFileLike } from '@tabler/icons-react'
import { padStart } from 'lodash'
import { LoadingSpinner } from '../LoadingSpinner'
import { useOrganization } from '../organization/OrganizationProvider'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const organization = useOrganization()

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Voucher da Reserva #{padStart(booking.id.toString(), 5, '0')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Voucher da Reserva {booking.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded shadow">
            <PDFViewer width="100%" className="h-100">
              <VoucherDocument booking={booking} organization={organization} />
            </PDFViewer>
          </div>

          <Button variant="outline" size="sm">
            <PDFDownloadLink
              document={
                <VoucherDocument
                  booking={booking}
                  organization={organization}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

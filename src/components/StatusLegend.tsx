import { BookingStatus, PaymentStatus } from '@/app/generated/prisma'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_PAYMENT_COLORS,
  STATUS_PAYMENT_LABELS,
} from '@/lib/utils'
import { IconMessageQuestion } from '@tabler/icons-react'
import { ButtonTooltip } from './ButtonTooltip'
import { Button } from './ui/button'

type StatusLegendItem = {
  label: string
  className: string
}

const statusItems: StatusLegendItem[] = [
  { label: 'Pendente', className: STATUS_COLORS.PENDING },
  { label: 'Confirmada', className: STATUS_COLORS.CONFIRMED },
  { label: 'Check-in', className: STATUS_COLORS.CHECKED_IN },
  { label: 'Hospedado', className: STATUS_COLORS.IN_PROGRESS },
  { label: 'Check-out', className: STATUS_COLORS.CHECKED_OUT },
  { label: 'Finalizada', className: STATUS_COLORS.FINALIZED },
  { label: 'Cancelada', className: STATUS_COLORS.CANCELLED },
  { label: 'No-show', className: STATUS_COLORS.NO_SHOW },
]

const paymentItems: StatusLegendItem[] = [
  { label: 'Pagamento Pendente', className: STATUS_PAYMENT_COLORS.PENDING },
  { label: 'Pagamento Concluído', className: STATUS_PAYMENT_COLORS.COMPLETED },
]

export function StatusLegend() {
  return (
    <Popover>
      <ButtonTooltip onClick={() => {}} tooltipText="Legenda" tooltipSide="top">
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="self-start">
            <IconMessageQuestion className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
      </ButtonTooltip>

      <PopoverContent className="space-y-3 text-xs w-64">
        <div>
          <p className="font-semibold mb-1">Reserva</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(BookingStatus).map(status => (
              <div key={status} className="flex items-center gap-1">
                <span
                  className={`w-3 h-3 rounded-full ${STATUS_COLORS[status]}`}
                />
                <span>{STATUS_LABELS[status]}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-1">Pagamento</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(PaymentStatus).map(status => (
              <div key={status} className="flex items-center gap-1">
                <span
                  className={`w-3 h-3 rounded-full ${STATUS_PAYMENT_COLORS[status]}`}
                />
                <span>{STATUS_PAYMENT_LABELS[status]}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

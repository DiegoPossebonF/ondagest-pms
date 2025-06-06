import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { STATUS_COLORS, STATUS_PAYMENT_COLORS } from '@/lib/utils'
import { Info } from 'lucide-react'
import { Button } from '../ui/button'

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

export function BookingStatusLegend() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="self-start">
          <Info className="w-4 h-4" />
          Legenda
        </Button>
      </PopoverTrigger>

      <PopoverContent className="space-y-3 text-xs w-64">
        <div>
          <p className="font-semibold mb-1">Reserva</p>
          <div className="flex flex-wrap gap-2">
            {statusItems.map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded-full ${item.className}`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-1">Pagamento</p>
          <div className="flex flex-wrap gap-2">
            {paymentItems.map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded-full ${item.className}`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

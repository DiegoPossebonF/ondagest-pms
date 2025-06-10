import IcBaselinePix from '@/components/icons/IcBaselinePix'
import MaterialSymbolsLightOtherAdmission from '@/components/icons/MaterialSymbolsLightOtherAdmission'
import { NimbusTransferReal } from '@/components/icons/NimbusTransferReal'
import SolarSquareTransferHorizontalBold from '@/components/icons/SolarSquareTransferHorizontalBold'
import MdiCreditCardCheck from '@/components/icons/mdi/MdiCreditCardCheck'
import MdiCreditCardClock from '@/components/icons/mdi/MdiCreditCardClock'
import {
  IconAlertTriangleFilled,
  IconBedFilled,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconClockHour4Filled,
  IconConfetti,
  IconDoorEnter,
  IconDoorExit,
} from '@tabler/icons-react'
import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import type { DateRange } from 'react-day-picker'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDifferenceInDays(period: DateRange) {
  return dayjs(period.to).diff(dayjs(period.from), 'day')
}

export const STATUS_LABELS = {
  PENDING: 'Pendente de pagamento',
  CONFIRMED: 'Confirmado',
  CHECKED_IN: 'Fazer Check-in',
  IN_PROGRESS: 'Hospedado',
  CHECKED_OUT: 'Fazer Check-out',
  FINALIZED: 'Finalizado',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'No show',
}

export const STATUS_ICONS = {
  PENDING: IconClockHour4Filled,
  CONFIRMED: IconConfetti,
  CHECKED_IN: IconDoorEnter,
  IN_PROGRESS: IconBedFilled,
  CHECKED_OUT: IconDoorExit,
  FINALIZED: IconCircleCheckFilled,
  CANCELLED: IconCircleXFilled,
  NO_SHOW: IconAlertTriangleFilled,
}

export const STATUS_COLORS = {
  PENDING:
    'bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 ease-in-out',
  CONFIRMED:
    'bg-emerald-500 hover:bg-emerald-600 transition-colors duration-300 ease-in-out',
  CHECKED_IN:
    'bg-orange-500 hover:bg-orange-600 transition-colors duration-300 ease-in-out',
  IN_PROGRESS:
    'bg-sky-500 hover:bg-sky-600 transition-colors duration-300 ease-in-out',
  CHECKED_OUT:
    'bg-rose-500 hover:bg-rose-600 transition-colors duration-300 ease-in-out',
  FINALIZED:
    'bg-gray-500 hover:bg-gray-600 transition-colors duration-300 ease-in-out',
  CANCELLED:
    'bg-red-600 hover:bg-red-700 transition-colors duration-300 ease-in-out',
  NO_SHOW:
    'bg-zinc-600 hover:bg-zinc-700 transition-colors duration-300 ease-in-out',
}

export const STATUS_COLORS_TEXT = {
  PENDING:
    'text-yellow-500 hover:text-yellow-600 transition-colors duration-200 ease-in-out',
  CONFIRMED:
    'text-emerald-500 hover:text-emerald-600 transition-colors duration-200 ease-in-out',
  CHECKED_IN:
    'text-orange-500 hover:text-orange-600 transition-colors duration-200 ease-in-out',
  IN_PROGRESS:
    'text-sky-500 hover:text-sky-600 transition-colors duration-200 ease-in-out',
  CHECKED_OUT:
    'text-rose-500 hover:text-rose-600 transition-colors duration-200 ease-in-out',
  FINALIZED:
    'text-gray-500 hover:text-gray-600 transition-colors duration-200 ease-in-out',
  CANCELLED:
    'text-red-600 hover:text-red-700 transition-colors duration-200 ease-in-out',
  NO_SHOW:
    'text-zinc-600 hover:text-zinc-700 transition-colors duration-200 ease-in-out',
}

export const STATUS_COLORS_TEXT_ONLY_HOVER = {
  PENDING: 'hover:text-yellow-600 transition-colors duration-200 ease-in-out',
  CONFIRMED:
    'hover:text-emerald-600 transition-colors duration-200 ease-in-out',
  CHECKED_IN:
    'hover:text-orange-600 transition-colors duration-200 ease-in-out',
  IN_PROGRESS: 'hover:text-sky-600 transition-colors duration-200 ease-in-out',
  CHECKED_OUT: 'hover:text-rose-600 transition-colors duration-200 ease-in-out',
  FINALIZED: 'hover:text-gray-600 transition-colors duration-200 ease-in-out',
  CANCELLED: 'hover:text-red-700 transition-colors duration-200 ease-in-out',
  NO_SHOW: 'hover:text-zinc-700 transition-colors duration-200 ease-in-out',
}

export const PAYMENT_TYPE_LABELS = {
  NONE: 'Selecione o tipo de pagamento...',
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  CASH: 'Dinheiro',
  BANK_TRANSFER: 'Transferência Bancária',
  OTHER: 'Outro',
}

export const PAYMENT_TYPE_ICONS = {
  PIX: IcBaselinePix,
  CREDIT_CARD: MdiCreditCardClock,
  DEBIT_CARD: MdiCreditCardCheck,
  CASH: NimbusTransferReal,
  BANK_TRANSFER: SolarSquareTransferHorizontalBold,
  OTHER: MaterialSymbolsLightOtherAdmission,
}

export const STATUS_PAYMENT_COLORS = {
  PENDING:
    'bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 ease-in-out',
  COMPLETED:
    'bg-emerald-500 hover:bg-emerald-600 transition-colors duration-300 ease-in-out',
}

export const STATUS_PAYMENT_COLORS_TEXT = {
  PENDING:
    'text-yellow-500 hover:text-yellow-600 transition-colors duration-300 ease-in-out',
  COMPLETED:
    'text-emerald-500 hover:text-emerald-600 transition-colors duration-300 ease-in-out',
}

export const STATUS_PAYMENT_LABELS = {
  PENDING: 'Pendente',
  COMPLETED: 'Pago',
}

export const formatCurrency = (amount: number) =>
  amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function parseCurrencyToNumber(value: string): number {
  return Number(value.replace(/[^\d,-]+/g, '').replace(',', '.'))
}

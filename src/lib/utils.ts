import IcBaselinePix from '@/components/icons/IcBaselinePix'
import MaterialSymbolsLightOtherAdmission from '@/components/icons/MaterialSymbolsLightOtherAdmission'
import { NimbusTransferReal } from '@/components/icons/NimbusTransferReal'
import SolarSquareTransferHorizontalBold from '@/components/icons/SolarSquareTransferHorizontalBold'
import MageCalendar2Fill from '@/components/icons/mage/MageCalendar2Fill'
import MageCalendarCheckFill from '@/components/icons/mage/MageCalendarCheckFill'
import MageCalendarCrossFill from '@/components/icons/mage/MageCalendarCrossFill'
import MageCalendarDownloadFill from '@/components/icons/mage/MageCalendarDownloadFill'
import MageCalendarFill from '@/components/icons/mage/MageCalendarFill'
import MageCalendarMinusFill from '@/components/icons/mage/MageCalendarMinusFill'
import MageCalendarQuestionMarkFill from '@/components/icons/mage/MageCalendarQuestionMarkFill'
import MageCalendarUploadFill from '@/components/icons/mage/MageCalendarUploadFill'
import MdiCreditCardCheck from '@/components/icons/mdi/MdiCreditCardCheck'
import MdiCreditCardClock from '@/components/icons/mdi/MdiCreditCardClock'
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
  PENDING: MageCalendarQuestionMarkFill,
  CONFIRMED: MageCalendarCheckFill,
  CHECKED_IN: MageCalendarUploadFill,
  IN_PROGRESS: MageCalendar2Fill,
  CHECKED_OUT: MageCalendarDownloadFill,
  FINALIZED: MageCalendarFill,
  CANCELLED: MageCalendarCrossFill,
  NO_SHOW: MageCalendarMinusFill,
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
    'text-yellow-500 hover:text-yellow-600 transition-colors duration-300 ease-in-out',
  CONFIRMED:
    'text-emerald-500 hover:text-emerald-600 transition-colors duration-300 ease-in-out',
  CHECKED_IN:
    'text-orange-500 hover:text-orange-600 transition-colors duration-300 ease-in-out',
  IN_PROGRESS:
    'text-sky-500 hover:text-sky-600 transition-colors duration-300 ease-in-out',
  CHECKED_OUT:
    'text-rose-500 hover:text-rose-600 transition-colors duration-300 ease-in-out',
  FINALIZED:
    'text-gray-500 hover:text-gray-600 transition-colors duration-300 ease-in-out',
  CANCELLED:
    'text-red-600 hover:text-red-700 transition-colors duration-300 ease-in-out',
  NO_SHOW:
    'text-zinc-600 hover:text-zinc-700 transition-colors duration-300 ease-in-out',
}

/*
export const STATUS_COLORS = {
  PENDING:
    'bg-yellow-400 hover:bg-yellow-500 transition-colors duration-300 ease-in-out',
  CONFIRMED:
    'bg-green-400 hover:bg-green-500 transition-colors duration-300 ease-in-out',
  CHECKED_IN:
    'bg-orange-400 hover:bg-orange-500 transition-colors duration-300 ease-in-out',
  IN_PROGRESS:
    'bg-blue-400 hover:bg-blue-500 transition-colors duration-300 ease-in-out',
  CHECKED_OUT:
    'bg-red-400 hover:bg-red-500 transition-colors duration-300 ease-in-out',
  FINALIZED:
    'bg-gray-400 hover:bg-gray-500 transition-colors duration-300 ease-in-out',
  CANCELLED:
    'bg-red-800 hover:bg-red-900 transition-colors duration-300 ease-in-out',
  NO_SHOW:
    'bg-gray-800 hover:bg-gray-900 transition-colors duration-300 ease-in-out',
}
    

export const STATUS_COLORS_TEXT = {
  PENDING:
    'text-yellow-400 hover:text-yellow-500 transition-colors duration-300 ease-in-out',
  CONFIRMED:
    'text-green-400 hover:text-green-500 transition-colors duration-300 ease-in-out',
  CHECKED_IN:
    'text-orange-400 hover:text-orange-500 transition-colors duration-300 ease-in-out',
  IN_PROGRESS:
    'text-blue-400 hover:text-blue-500 transition-colors duration-300 ease-in-out',
  CHECKED_OUT:
    'text-red-300 hover:text-red-400 transition-colors duration-300 ease-in-out',
  FINALIZED:
    'text-gray-400 hover:text-gray-500 transition-colors duration-300 ease-in-out',
  CANCELLED:
    'text-red-800 hover:text-red-900 transition-colors duration-300 ease-in-out',
  NO_SHOW:
    'text-gray-800 hover:text-gray-900 transition-colors duration-300 ease-in-out',
}

*/

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

export const formatCurrency = (amount: number) =>
  amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function parseCurrencyToNumber(value: string): number {
  return Number(value.replace(/[^\d,-]+/g, '').replace(',', '.'))
}

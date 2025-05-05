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

export const PAYMENT_TYPE_LABELS = {
  NONE: 'Selecione o tipo de pagamento...',
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  CASH: 'Dinheiro',
  BANK_TRANSFER: 'Transferência Bancária',
  OTHER: 'Outro',
}

export const STATUS_COLORS = {
  PENDING: 'bg-yellow-400',
  CONFIRMED: 'bg-green-400',
  CHECKED_IN: 'bg-orange-400',
  IN_PROGRESS: 'bg-blue-400',
  CHECKED_OUT: 'bg-red-400',
  FINALIZED: 'bg-gray-400',
  CANCELLED: 'bg-red-800',
  NO_SHOW: 'bg-gray-800',
}

export const STATUS_PAYMENT_COLORS = {
  PENDING: 'text-red-400',
  COMPLETED: 'text-green-400',
}

export const formatCurrency = (amount: number) =>
  amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function parseCurrencyToNumber(value: string): number {
  return Number(value.replace(/[^\d,-]+/g, '').replace(',', '.'))
}

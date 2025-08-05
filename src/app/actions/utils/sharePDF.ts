'use server'

import { formatPhoneNumber } from '@/lib/utils'

export async function shareVoucher(
  publicId: string,
  message: string,
  phone: string
) {
  const linkVoucher = `${process.env.NEXT_PUBLIC_API_URL}/booking/voucher/${publicId}`

  const msg = message.replace('[LINK]', linkVoucher)

  const encodedMessage = encodeURIComponent(msg || '')
  const whatsappLink = `https://api.whatsapp.com/send?phone=55${formatPhoneNumber(phone)}&text=${encodedMessage}`

  return whatsappLink
}

export async function shareReceipt(
  paymentId: string,
  message: string,
  phone: string
) {
  const linkReceipt = `${process.env.NEXT_PUBLIC_API_URL}/booking/receipt/${paymentId}`

  const msg = message.replace('[LINK]', linkReceipt)

  const encodedMessage = encodeURIComponent(msg || '')
  const whatsappLink = `https://api.whatsapp.com/send?phone=55${formatPhoneNumber(phone)}&text=${encodedMessage}`

  return whatsappLink
}

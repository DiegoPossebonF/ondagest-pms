'use server'
import type { Payment } from '@/app/generated/prisma'
import { generateReceiptPdfBuffer } from '@/components/pdf/ReceiptDocument'
import type { BookingAllIncludes } from '@/types/booking'
import { generateSignedPdfUrl } from '../storage/generateSignedPdfUrl'
import { uploadVoucherOrReceiptPdf } from '../storage/uploadVoucherOrReceiptPdf'

export async function uploadReceipt(
  booking: BookingAllIncludes,
  payment: Payment
) {
  const buffer = await generateReceiptPdfBuffer(booking, payment) // Buffer do PDF
  const uploadResult = await uploadVoucherOrReceiptPdf(buffer, 'recibo-teste')

  if (uploadResult.error || !uploadResult.path) {
    return { error: uploadResult.error }
  }

  const signedUrl = await generateSignedPdfUrl(uploadResult.path)

  if (signedUrl.error || !signedUrl.url) {
    return { error: signedUrl.error }
  }

  return { signedUrl: signedUrl.url }
}

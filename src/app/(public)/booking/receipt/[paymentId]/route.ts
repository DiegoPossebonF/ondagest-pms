import { getPaymentById } from '@/app/actions/payment/actions'
import { generateReceiptDocument } from '@/components/pdf/ReceiptDocument'
import { padNumber } from '@/lib/utils'
import { renderToBuffer } from '@react-pdf/renderer'
import type { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params

    if (!paymentId) {
      return new Response('ID de pagamento inválido.', { status: 400 })
    }

    const { data: payment, error: paymentError } =
      await getPaymentById(paymentId)

    if (paymentError) {
      return new Response(paymentError, { status: 404 })
    }

    if (!payment) {
      return new Response('Pagamento não encontrado.', { status: 404 })
    }

    const doc = await generateReceiptDocument(payment)
    const buffer = await renderToBuffer(doc)

    // ✅ Converter Buffer para Uint8Array
    const uint8Array = new Uint8Array(buffer)

    return new Response(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="receipt-${padNumber(payment.bookingId)}-${paymentId}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar PDF do recibo:', error)
    return new Response('Erro interno ao gerar o documento PDF do recibo.', {
      status: 500,
    })
  }
}

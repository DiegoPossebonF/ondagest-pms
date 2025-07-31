import { getBookingByPublicId } from '@/app/actions/booking/actions'
import { generateVoucherDocument } from '@/components/pdf/VoucherDocument'
import { padNumber } from '@/lib/utils'
import { renderToBuffer } from '@react-pdf/renderer'
import type { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const { publicId } = await params

    if (!publicId) {
      return new Response('Public ID de reserva inválido.', { status: 400 })
    }

    const { data: booking, error: bookingError } =
      await getBookingByPublicId(publicId)

    if (bookingError || !booking) {
      return new Response('Reserva nao encontrada.', { status: 404 })
    }

    const doc = await generateVoucherDocument(booking)
    const buffer = await renderToBuffer(doc)

    // ✅ Converter Buffer para Uint8Array
    const uint8Array = new Uint8Array(buffer)

    return new Response(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="voucher-${padNumber(booking.id)}-${publicId}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar PDF do voucher:', error)
    return new Response('Erro interno ao gerar o documento PDF do voucher.', {
      status: 500,
    })
  }
}

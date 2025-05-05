import type { PaymentFormValues } from '@/components/payment/PaymentForm'

export async function createPayment(values: PaymentFormValues) {
  const cleanAmount = Number.parseFloat(
    values.amount
      .replace(/[^\d,-]/g, '') // remove tudo que não é número, vírgula ou hífen
      .replace(',', '.') // troca vírgula por ponto para parseFloat funcionar
  )

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
      method: 'POST',
      body: JSON.stringify({
        amount: cleanAmount,
        bookingId: Number.parseInt(values.bookingId),
        paymentType: values.paymentType,
        paidAt: values.paidAt,
      }),
    })
    const data = await res.json()
    if (!data.error) {
      return data
    }

    throw new Error(data.error)
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message }
    }
  }
}

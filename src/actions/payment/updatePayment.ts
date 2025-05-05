import type { PaymentFormValues } from '@/components/payment/PaymentForm'
import { parseCurrencyToNumber } from '@/lib/utils'

export async function updatePayment(
  values: PaymentFormValues,
  paymentId: string
) {
  try {
    const parsedAmount = parseCurrencyToNumber(values.amount)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/payments/${paymentId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          ...values,
          amount: parsedAmount,
        }),
      }
    )

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

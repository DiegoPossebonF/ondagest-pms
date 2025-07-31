'use server'

import db from '@/lib/db'

export async function getPaymentById(id: string) {
  try {
    const payment = await db.payment.findUnique({
      where: { id },
    })

    if (!payment) {
      return {
        data: null,
        error: 'Pagamento não encontrado',
      }
    }

    return {
      data: payment,
      error: null,
    }
  } catch (error) {
    console.error('Erro ao buscar pagamento por ID!', error)
    return {
      data: null,
      error:
        'Erro ao buscar pagamento por ID - tente novamente mais tarde ou contate o suporte!',
    }
  }
}

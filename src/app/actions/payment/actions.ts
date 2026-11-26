'use server'
import db from '@/lib/db'

export async function getPaymentById(id: string) {
  try {
    // Busca pública (capability URL): o `id` (UUID) é a autorização.
    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        organization: true,
        booking: {
          include: {
            guest: true,
            unit: {
              include: {
                type: { include: { rates: { include: { type: true } } } },
              },
            },
            payments: true,
            services: true,
            discounts: true,
            rate: { include: { type: true } },
          },
        },
      },
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

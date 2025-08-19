'use server'
import dbWithTenant from '../utils/dbWithTenant'

export async function getPaymentById(id: string) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

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

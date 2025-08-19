'use server'
import dbWithTenant from '../utils/dbWithTenant'

export async function deleteService(serviceId: string) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    if (!serviceId)
      return {
        success: false,
        msg: 'ID do serviço é obrigatorio',
      }

    const deletedService = await db.service.delete({
      where: {
        id: serviceId,
      },
    })

    if (!deleteService) {
      return {
        success: false,
        msg: 'Erro ao deletar serviço - DB',
      }
    }

    return {
      success: true,
      payment: deleteService,
      msg: 'Serviço removido com sucesso',
    }
  } catch (err) {
    console.error('Erro ao deletar serviço', err)
    return {
      success: false,
      msg: 'Erro inesperado ao deletar serviço - entre em contato com o suporte',
    }
  }
}

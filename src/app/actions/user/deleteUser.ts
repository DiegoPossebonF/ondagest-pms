'use server'

import dbWithTenant from '../utils/dbWithTenant'

export async function deleteUser(userId: string, role: string) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  try {
    // Se o usuário for Proprietario, não pode ser excluido
    if (role === 'OWNER') {
      return { error: 'Proprietário não pode ser excluido' }
    }

    // Excluir o usuário
    await db.user.delete({
      where: { id: userId },
    })

    return { success: 'Usuário excluído com sucesso' }
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
    return { error: 'Erro ao excluir usuário' }
  }
}

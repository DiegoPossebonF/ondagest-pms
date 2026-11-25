'use server'

import dbWithTenant from '../utils/dbWithTenant'
import { getSessionUser } from '../utils/get-session-user'

export async function deleteUser(userId: string) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const sessionUser = await getSessionUser()
  if (
    !sessionUser ||
    (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'OWNER')
  ) {
    return { error: 'Você não tem permissão para excluir usuários.' }
  }

  try {
    // O papel do alvo é derivado do banco (não de dados do cliente)
    const target = await db.user.findUnique({
      where: { id: userId },
    })

    if (!target) {
      return { error: 'Usuário não encontrado.' }
    }

    if (target.id === sessionUser.id) {
      return { error: 'Você não pode excluir a si mesmo.' }
    }

    if (target.role === 'OWNER') {
      return { error: 'Proprietário não pode ser excluído.' }
    }

    if (target.role === 'ADMIN' && sessionUser.role !== 'OWNER') {
      return { error: 'Apenas o proprietário pode excluir administradores.' }
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

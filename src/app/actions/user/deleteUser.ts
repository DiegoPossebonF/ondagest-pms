// src/actions/deleteUser.ts
'use server'

import dbWithTenant from '@/lib/dbWithTenant'

export async function deleteUser(userId: string, role: string) {
  try {
    const { db, error } = await dbWithTenant()
    if (error) return { error: error }
    if (!db) return { error: 'Banco de dados não disponível' }

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

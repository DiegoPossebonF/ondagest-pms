// src/actions/deleteUser.ts
'use server'

import db from '@/lib/db'

export async function deleteUser(userId: string, role: string) {
  try {
    // Se o usuário for ADMIN, garantir que existirá pelo menos outro admin
    if (role === 'ADMIN') {
      const adminCount = await db.user.count({
        where: {
          role: 'ADMIN',
          NOT: { id: userId }, // não conta ele mesmo
        },
      })

      if (adminCount < 1) {
        return {
          error:
            'Não é possivel excluir o usuário, pois ele é o ultimo administrador cadastrado!',
        }
      }
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

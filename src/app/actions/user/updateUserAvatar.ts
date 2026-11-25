'use server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { optimizeImageWithSharp } from '@/utils/optimizeImageWithSharp'
import { revalidatePath } from 'next/cache'
import dbWithTenant from '../utils/dbWithTenant'
import { getSessionUser } from '../utils/get-session-user'

export async function updateUserAvatar(userId: string, file: File) {
  const { db: dbData, error } = await dbWithTenant()
  if (error) throw new Error(error)
  if (!dbData) throw new Error('Banco de dados não disponível')

  const db = dbData

  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    return { error: 'Sessão inválida.' }
  }

  // Só permite alterar o avatar do próprio usuário logado
  if (userId !== sessionUser.id) {
    return { error: 'Você só pode alterar o seu próprio avatar.' }
  }

  try {
    if (file.type !== 'image/png' && file.type !== 'image/jpeg')
      return { error: 'Formato inválido (apenas PNG ou JPEG).' }

    // Usa o id da sessão (não o informado pelo cliente)
    const path = `avatar/${sessionUser.id}.${file.type.split('/')[1]}`

    // 🔸 Tenta remover o avatar anterior
    await supabaseAdmin.storage.from('public-media').remove([path])

    const buffer = Buffer.from(await file.arrayBuffer())

    const optimizedBuffer = await optimizeImageWithSharp(buffer, {
      width: 500,
      height: 500,
      format: file.type.split('/')[1] as 'jpeg' | 'png',
      quality: 70,
      crop: true, // 🔹 corta centralizado para quadrado fixo
    })

    // 🔸 Tenta fazer o upload
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from('public-media')
      .upload(path, optimizedBuffer, {
        upsert: false,
        contentType: file.type,
        cacheControl: '3600',
      })

    if (uploadError || !data) {
      console.error('Erro ao fazer upload do avatar do usuário:', uploadError)
      return { error: 'Erro ao fazer upload do avatar do usuário.' }
    }

    // 🔸 Gera URL com versionamento para forçar cache refresh
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/public-media/${path}?v=${Date.now()}`

    // 🔸 Atualiza no banco de dados
    await db.user.update({
      where: { id: sessionUser.id },
      data: { image: publicUrl },
    })

    revalidatePath('/settings') // ou a rota que exibe o logo
    return { success: true, url: publicUrl }
  } catch (err) {
    console.error('Erro ao atualizar o avatar do usuário:', err)
    return { error: 'Erro inesperado ao atualizar o avatar do usuário.' }
  }
}

'use server'
import db from '@/lib/db'
import { supabase } from '@/lib/supabase/client'
import { optimizeImageWithSharp } from '@/utils/optimizeImageWithSharp'
import { revalidatePath } from 'next/cache'

export async function updateUserAvatar(userId: string, file: File) {
  try {
    if (file.type !== 'image/png' && file.type !== 'image/jpeg')
      return { error: 'Formato inválido (apenas PNG ou JPEG).' }

    const path = `avatar/${userId}.${file.type.split('/')[1]}`

    // 🔸 Tenta remover o logo anterior
    await supabase.storage.from('public-media').remove([path])

    const buffer = Buffer.from(await file.arrayBuffer())

    const optimizedBuffer = await optimizeImageWithSharp(buffer, {
      width: 500,
      height: 500,
      format: file.type.split('/')[1] as 'jpeg' | 'png',
      quality: 70,
      crop: true, // 🔹 corta centralizado para quadrado fixo
    })

    // 🔸 Tenta fazer o upload
    const { data, error: uploadError } = await supabase.storage
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
      where: { id: userId },
      data: { image: publicUrl },
    })

    revalidatePath('/settings') // ou a rota que exibe o logo
    return { success: true, url: publicUrl }
  } catch (err) {
    console.error('Erro ao atualizar o avatar do usuário:', err)
    return { error: 'Erro inesperado ao atualizar o avatar do usuário.' }
  }
}

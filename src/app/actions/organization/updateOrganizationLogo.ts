'use server'
import db from '@/lib/db'
import { supabase } from '@/lib/supabase/client'
import { optimizeImageWithSharp } from '@/utils/optimizeImageWithSharp'
import { revalidatePath } from 'next/cache'

export async function updateOrganizationLogo(orgId: string, file: File) {
  try {
    const path = `logos/${orgId}.png`

    // 🔸 Tenta remover o logo anterior
    await supabase.storage.from('public-media').remove([path])

    const buffer = Buffer.from(await file.arrayBuffer())

    const optimizedBuffer = await optimizeImageWithSharp(buffer, {
      width: 500,
      height: 500,
      format: 'webp',
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
      console.error('Erro ao fazer upload do novo logotipo:', uploadError)
      return { error: 'Erro ao fazer upload do novo logotipo.' }
    }

    // 🔸 Gera URL com versionamento para forçar cache refresh
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/public-media/${path}?v=${Date.now()}`

    // 🔸 Atualiza no banco de dados
    await db.organization.update({
      where: { id: orgId },
      data: { logoUrl: publicUrl },
    })

    revalidatePath('/settings') // ou a rota que exibe o logo
    return { success: true, url: publicUrl }
  } catch (err) {
    console.error('Erro ao atualizar logo da organização:', err)
    return { error: 'Erro inesperado ao atualizar o logotipo.' }
  }
}

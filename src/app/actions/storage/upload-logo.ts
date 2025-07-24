'use server'

import { uploadPublicImage } from '@/lib/supabase/storage/upload'
import { updateOrganizationLogo } from '../organization/actions'

export async function uploadLogo(organizationId: string, file: File) {
  //const buffer = Buffer.from(await file.arrayBuffer())
  const path = `logos/${Date.now()}-${file.name}`
  const { error, url } = await uploadPublicImage(file, path)

  if (error || !url) {
    console.error('Erro ao enviar imagem:', error)
    return { error: 'Erro ao enviar imagem.' }
  }

  const response = await updateOrganizationLogo(organizationId, url)

  if (response?.error) return { error: response.error }

  return { url }
}

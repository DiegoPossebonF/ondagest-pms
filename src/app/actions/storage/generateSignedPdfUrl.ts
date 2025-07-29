'use server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function generateSignedPdfUrl(
  filePath: string,
  expiresInSeconds = 86400
) {
  const { data, error } = await supabaseAdmin.storage
    .from('private-media')
    .createSignedUrl(filePath, expiresInSeconds)

  if (error) {
    return { error: error.message, url: null }
  }

  return { error: null, url: data.signedUrl }
}

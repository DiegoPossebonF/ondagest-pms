'use server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { supabase } from '@/lib/supabase/client'

export async function uploadPublicImage(
  file: File,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  const { data, error } = await supabase.storage
    .from('public-media')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) return { url: null, error: error.message }

  const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/public-media/${path}`
  return { url, error: null }
}

export async function uploadPrivateFile(
  buffer: Buffer,
  path: string,
  contentType = 'application/octet-stream'
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabaseAdmin.storage
    .from('private-media')
    .upload(path, buffer, {
      contentType,
      upsert: true,
    })

  if (error) return { success: false, error: error.message }
  return { success: true, error: null }
}

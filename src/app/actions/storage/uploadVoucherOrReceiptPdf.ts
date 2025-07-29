'use server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function uploadVoucherOrReceiptPdf(
  fileBuffer: Buffer,
  fileName: string
) {
  const filePath = `documents/${fileName}.pdf`

  const { error } = await supabaseAdmin.storage
    .from('private-media')
    .upload(filePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (error) {
    return { error: error.message, url: null }
  }

  return { error: null, path: filePath }
}

// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ehdmonsxsmbxxignohvz.supabase.co'
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZG1vbnN4c21ieHhpZ25vaHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNDk0OTAsImV4cCI6MjA1NDcyNTQ5MH0.XTSW-0R6jdBTAFkUAnMJXz_I5SCsOsgsUplPwx4V6XE'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const getSignedUrl = async (bucketName: string, filePath: string) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 60) // 60 segundos de validade

  if (error) {
    console.error('Erro ao gerar a URL assinada:', error)
    return null
  }

  return data.signedUrl
}

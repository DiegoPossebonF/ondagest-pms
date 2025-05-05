'use client'
import { useEffect, useState } from 'react'

const SupabaseImage = ({ filePath }: { filePath: string }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const response = await fetch(`/api/upload?filePath=${filePath}`, {
        method: 'GET',
      })
      const data = await response.json()
      console.log(data)
      setSignedUrl(data.signedUrl)
    }

    fetchSignedUrl()
  }, [filePath])

  return signedUrl ? (
    <img src={signedUrl} alt="Imagem do Supabase" />
  ) : (
    <p>Carregando imagem...</p>
  )
}

export default SupabaseImage

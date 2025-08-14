'use server'

export async function getImageBase64(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl)
    if (!res.ok) {
      console.error('Erro ao buscar imagem:', res.statusText)
      return null
    }

    const buffer = await res.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    // Detecta o tipo da imagem com base no header ou extensão
    let ext = imageUrl.split('.').pop()?.toLowerCase() || 'jpeg'
    ext = ext.split('?')[0]

    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'

    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Erro ao converter imagem para base64:', error)
    return null
  }
}

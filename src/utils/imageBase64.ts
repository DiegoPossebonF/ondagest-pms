'use server'
export async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mimeType = response.headers.get('Content-Type') || 'image/png'
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Erro ao converter imagem:', error)
    return null
  }
}

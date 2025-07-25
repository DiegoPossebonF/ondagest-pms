import sharp from 'sharp'

export async function optimizeImageWithSharp(
  buffer: Buffer,
  options?: {
    width?: number
    height?: number
    format?: 'jpeg' | 'webp' | 'png' | 'avif'
    quality?: number
    crop?: boolean // novo
  }
): Promise<Buffer> {
  const {
    width = 600,
    height = 600,
    format = 'webp',
    quality = 75,
    crop = false,
  } = options || {}

  let image = sharp(buffer)

  if (crop) {
    image = image.resize(width, height, {
      fit: 'cover', // corta o excesso para caber
      position: 'center', // centraliza o foco do corte
    })
  } else {
    image = image.resize({ width, height, fit: 'inside' }) // mantém proporção
  }

  if (format === 'webp') return image.webp({ quality }).toBuffer()
  if (format === 'png') return image.png({ quality }).toBuffer()
  if (format === 'avif') return image.avif({ quality }).toBuffer()

  return image.jpeg({ quality }).toBuffer()
}

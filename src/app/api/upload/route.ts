import { getSignedUrl, supabase } from '@/lib/supabase'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    //const body = await req.json()

    //const { avatar: file } = body

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado.' },
        { status: 400 }
      )
    }

    const fileName = `${Date.now()}-${file.name}`

    // Faz upload do arquivo para o Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads') // Nome do bucket
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // Não sobrescreve arquivos com o mesmo nome
      })

    if (error) {
      console.error('Erro no upload:', error)
      return NextResponse.json(
        { error: 'Erro ao fazer upload do arquivo.' },
        { status: 500 }
      )
    }

    // Gera a URL pública do arquivo
    const publicUrl = supabase.storage.from('uploads').getPublicUrl(fileName)
      .data.publicUrl

    return NextResponse.json({
      message: 'Upload bem-sucedido!',
      fileUrl: publicUrl,
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get('filePath')
  console.log('file', file)
  if (!file) {
    return NextResponse.json(
      { message: 'Nenhum arquivo foi enviado.' },
      {
        status: 400,
      }
    )
  }

  const signedUrl = await getSignedUrl('uploads', file as string)
  if (!signedUrl) {
    return NextResponse.json(
      { message: 'Nenhum arquivo foi enviado.' },
      {
        status: 400,
      }
    )
  }

  return NextResponse.json({ signedUrl }, { status: 200 })
}

'use client'
import { updateOrganizationLogo } from '@/app/actions/organization/updateOrganizationLogo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ImageOff, UploadCloud } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Input } from './ui/input'

interface ImageUploadProps {
  organizationId: string
  initialImage?: string
}

export function ImageUpload({
  organizationId,
  initialImage,
}: ImageUploadProps) {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  async function handleUpload() {
    if (!file) return
    setLoading(true)

    try {
      const response = await updateOrganizationLogo(organizationId, file)

      if (response?.error) {
        toast.error(response.error)
        setLoading(false)
        return
      }

      if (response?.url) {
        setPreview(response.url)
        setFile(null)
        toast.success('Imagem enviada com sucesso!')
        router.refresh()
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error)
    }

    setLoading(false)
  }

  return (
    <div className="w-40 space-y-2">
      {/* Preview dentro de Card */}
      <Card
        onClick={() => inputRef.current?.click()}
        className={cn(
          'cursor-pointer rounded-md w-40 h-40 p-1 flex items-center justify-center overflow-hidden bg-muted hover:ring-2 ring-primary transition'
        )}
      >
        <CardContent className="flex items-center justify-center w-full h-full p-0">
          {preview ? (
            <img
              src={preview}
              alt="Pré-visualização"
              className="object-cover w-full h-full rounded-md"
            />
          ) : (
            <ImageOff className="w-8 h-8 text-muted-foreground" />
          )}
        </CardContent>
      </Card>

      {/* Input invisível */}
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={inputRef}
        className="hidden"
      />

      {/* Botão de upload */}
      {file && (
        <Button
          onClick={handleUpload}
          disabled={loading}
          variant={'outline'}
          size={'sm'}
          className="w-full"
        >
          {loading ? (
            'Enviando...'
          ) : (
            <>
              <UploadCloud className="w-4 h-4 mr-2" />
              Atualizar
            </>
          )}
        </Button>
      )}
    </div>
  )
}

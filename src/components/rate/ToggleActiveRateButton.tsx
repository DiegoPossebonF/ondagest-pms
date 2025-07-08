import { toggleActiveRate } from '@/app/actions/rate/actions'
import { Button } from '@/components/ui/button'
import { IconEyeOff } from '@tabler/icons-react'
import { EyeIcon } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

export function ToggleActiveRateButton({
  rateId,
  isActive,
}: { rateId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await toggleActiveRate(rateId, !isActive)
          if (res.error) {
            toast('Erro', { description: res.error, icon: '🚨' })
          } else {
            toast('Sucesso', { description: res.success, icon: '✅' })
          }
        })
      }}
    >
      {isActive ? (
        <IconEyeOff className="w-4 h-4 mr-2" />
      ) : (
        <EyeIcon className="w-4 h-4 mr-2" />
      )}
      {isActive ? 'Desativar' : 'Ativar'}
    </Button>
  )
}

'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRouter, useSearchParams } from 'next/navigation'

export function AccessDenied() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')
  const isOpen = error === 'unauthorized'

  function handleClose() {
    router.replace(window.location.pathname) // Remove query param da URL
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Acesso Negado</AlertDialogTitle>
          <AlertDialogDescription>
            Você não tem permissão para acessar essa página.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>Entendi</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

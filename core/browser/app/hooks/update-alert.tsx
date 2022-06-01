import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'

import { ipcSystem } from '@/browser/api/system'

export const useUpdateAlert = () => {
  const toast = useToast()

  useEffect(() => {
    ipcSystem.invoke('update:check').then((available) => {
      if (!available) return
      toast({
        title: '最新版が利用可能🍡',
        description: '再起動することで最新版に更新できます。',
        status: 'info',
        duration: 10_000,
        isClosable: true,
        position: 'bottom-right',
      })
    })
  }, [])
}

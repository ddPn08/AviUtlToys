import { Box, Button, Text, useToast } from '@chakra-ui/react'

import { ipcSystem } from '@/browser/api/system'
import { InputItem } from '@/browser/components/input-item'

export const RunAviUtl: React.FC = () => {
  const toast = useToast()
  return (
    <Box>
      <InputItem
        label={<Text>AviUtlを起動する</Text>}
        input={
          <Button
            onClick={async () => {
              try {
                await ipcSystem.invoke('aviutl:run')
              } catch (error: any) {
                toast({
                  title: 'AviUtlの起動に失敗しました',
                  description: error.message,
                  status: 'error',
                })
              }
            }}
          >
            起動
          </Button>
        }
      />
    </Box>
  )
}

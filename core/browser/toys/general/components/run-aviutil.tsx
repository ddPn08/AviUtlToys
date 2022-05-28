import { Box, Button, Text, useToast } from '@chakra-ui/react'

import { ipcSystem } from '@/browser/api/system'
import { InputItem } from '@/browser/components/input-item'

export const RunAviutil: React.FC = () => {
  const toast = useToast()
  return (
    <Box>
      <InputItem
        label={<Text>Aviutilを起動する</Text>}
        input={
          <Button
            onClick={async () => {
              try {
                await ipcSystem.invoke('aviutil:run')
              } catch (error: any) {
                toast({
                  title: 'Aviutilの起動に失敗しました',
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

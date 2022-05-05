import { HStack, Input, Stack } from '@chakra-ui/react'
import { useState } from 'react'

import { ExoDraggable } from './exo-draggable'

import { ExoMeta } from '@/types/exos'

export const ExoList: React.FC<{ exos: ExoMeta[] }> = ({ exos }) => {
  const [search, setSearch] = useState('')

  return (
    <Stack>
      <Input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <HStack>
        {exos
          .filter((e) => e.displayName.includes(search) || e.id.includes(search))
          .map((exo) => (
            <ExoDraggable key={exo.id} exo={exo} />
          ))}
      </HStack>
    </Stack>
  )
}

import { ipcApi } from '@aviutil-toys/api/client'
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import type { ReadOptions } from 'softalk'

import { SofTalkContext } from '..'

import { ipc } from '@/client/api'

const CheckReadOptions = (options: Partial<ReadOptions>): options is ReadOptions => {
  return (
    options.voice !== undefined &&
    options.speed !== undefined &&
    options.speed >= 0 &&
    options.speed <= 300 &&
    options.speed % 1 === 0 &&
    options.interval !== undefined &&
    options.interval >= 0 &&
    options.interval <= 200 &&
    options.interval % 1 === 0 &&
    options.volume !== undefined &&
    options.volume >= 0 &&
    options.volume <= 100 &&
    options.volume % 1 === 0
  )
}

export const Controller: React.FC = () => {
  const { readOptions, subTitle, frameRate, setFrameRate } = useContext(SofTalkContext)
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [dragFile, setDragFile] = useState<string | null>(null)
  const [text, setText] = useState('')
  return (
    <>
      <Textarea
        placeholder="ここにテキストを入力してください"
        value={text}
        onChange={(e) => {
          setDragFile(null)
          setText(e.currentTarget.value)
        }}
        size="lg"
      />
      <Flex justifyContent="space-between">
        <ButtonGroup m="2">
          <Button
            isLoading={isLoading}
            onClick={async () => {
              if (!text)
                return toast({
                  title: 'テキストが空です',
                  description: 'テキストを入力してください',
                  status: 'error',
                  duration: 3000,
                })
              if (!CheckReadOptions(readOptions)) {
                console.error('readOptions is invalid', readOptions)
                return
              }
              setIsLoading(true)
              const file = await ipc.invoke('voice:craete', text, frameRate, readOptions, subTitle)
              setIsLoading(false)
              setDragFile(file)
            }}
          >
            合成
          </Button>
          <Button
            onClick={() => {
              if (!text) return
              if (!CheckReadOptions(readOptions)) {
                console.error('readOptions is invalid', readOptions)
                return
              }
              ipc.invoke('voice:play', text, readOptions)
            }}
          >
            再生
          </Button>
          <Flex
            justifyContent="center"
            alignItems="center"
            px="4"
            border="2px"
            borderStyle="dotted"
            draggable
            onDragStart={(e) => {
              if (!dragFile) return
              e.preventDefault()
              ipcApi.invoke('native:drag-file', dragFile)
            }}
          >
            <Heading size="sm">
              {dragFile
                ? 'ここをドラッグしてAviutilに読みいこませて下さい。'
                : '合成ボタンを押して音声を生成します。'}
            </Heading>
          </Flex>
        </ButtonGroup>
      </Flex>
      <Text>フレームレート (FPS)</Text>
      <Input
        type="number"
        value={frameRate}
        onChange={(e) => setFrameRate(parseInt(e.currentTarget.value || '60'))}
      />
    </>
  )
}

import { ipcApi } from '@aviutl-toys/api/client'
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Switch,
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
  const { readOptions, subTitle, frameRate, setFrameRate, exoVolume, setExoVolume } =
    useContext(SofTalkContext)
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [dragFile, setDragFile] = useState<string | null>(null)
  const [pronunciation, setPronunciation] = useState('')
  const [subTitleText, setSubTitleText] = useState('')
  const [syncSubTitle, setSyncSubTitle] = useState(true)
  return (
    <>
      <Stack spacing={2}>
        <Textarea
          placeholder="字幕"
          value={subTitleText}
          onChange={(e) => {
            if (syncSubTitle) setPronunciation(e.currentTarget.value)
            if (!e.currentTarget.value) {
              setPronunciation(e.currentTarget.value)
              setSyncSubTitle(true)
            }
            setDragFile(null)
            setSubTitleText(e.currentTarget.value)
          }}
          size="lg"
        />
        <Textarea
          placeholder="発生記号"
          value={pronunciation}
          size="lg"
          onChange={(e) => {
            setSyncSubTitle(false)
            setPronunciation(e.currentTarget.value)
          }}
        />
      </Stack>
      <Flex justifyContent="space-between">
        <ButtonGroup m="2">
          <Button
            isLoading={isLoading}
            onClick={async () => {
              if (!pronunciation)
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
              const file = await ipc.invoke(
                'voice:craete',
                pronunciation,
                subTitleText,
                frameRate,
                readOptions,
                subTitle,
                exoVolume,
              )
              setIsLoading(false)
              setDragFile(file)
            }}
          >
            合成
          </Button>
          <Button
            onClick={() => {
              if (!pronunciation) return
              if (!CheckReadOptions(readOptions)) {
                console.error('readOptions is invalid', readOptions)
                return
              }
              ipc.invoke('voice:play', pronunciation, readOptions)
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
                ? 'ここをドラッグしてAviUtlのタイムラインにドロップしてください。'
                : '合成ボタンを押して音声を生成します。'}
            </Heading>
          </Flex>
          <HStack>
            <Heading size="sm">字幕をコピー</Heading>
            <Switch
              isChecked={syncSubTitle}
              onChange={(e) => {
                setSyncSubTitle(e.currentTarget.checked)
                if (e.currentTarget.checked) {
                  setPronunciation(subTitleText)
                }
              }}
            />
          </HStack>
        </ButtonGroup>
      </Flex>
      <Text>フレームレート (FPS)</Text>
      <Input
        type="number"
        value={frameRate}
        onChange={(e) => setFrameRate(parseInt(e.currentTarget.value || '60'))}
      />
      <Text>AviUtl上での音量</Text>
      <Input
        type="number"
        value={exoVolume}
        onChange={(e) => setExoVolume(parseInt(e.currentTarget.value || '100'))}
      />
    </>
  )
}

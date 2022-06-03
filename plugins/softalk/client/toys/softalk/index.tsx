import { useToyContext } from '@aviutil-toys/api/client'
import {
  Box,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReadOptions } from 'softalk'

import { Controller } from './components/controller'
import { Options } from './components/options'
import { Presets } from './components/presets'
import { SubTitles } from './components/subtitle'

import { ipc } from '@/client/api'
import { lastPresetAtom } from '@/client/state'

const StatusChecker: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isEnabled, setIsEnabled] = useState(false)
  const navigate = useNavigate()
  const ToyContext = useToyContext()
  const disclosure = useDisclosure()
  if (isLoading) {
    ipc.invoke('enabled').then((enabled) => {
      setIsLoading(false)
      setIsEnabled(enabled)
    })
    return <></>
  }
  disclosure.isOpen = true
  return isEnabled ? (
    <>{children}</>
  ) : (
    <Box>
      <Modal onClose={disclosure.onClose} isOpen={disclosure.isOpen} size="xl">
        <ModalOverlay />
        <ModalContent w="80%">
          <ModalHeader>SofTalkがインストールされていません。</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              disclosure.onClose()
              navigate(-1)
            }}
          />
          <ModalBody>
            <Input value={ToyContext.pluginDataPath + '\\softalk'} readOnly />
            <Text>にsoftalkのフォルダをコピーしてください。</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

type SofTalkContextType = {
  readOptions: Partial<ReadOptions>
  setReadOptions: (readOptions: Partial<ReadOptions>) => void
  subTitle: string
  setSubTitle: (subTitle: string) => void
  frameRate: number
  setFrameRate: (frameRate: number) => void
}

export const SofTalkContext = createContext<SofTalkContextType>({} as SofTalkContextType)

export const SofTalk: React.FC = () => {
  const [lastPreset] = useAtom(lastPresetAtom)
  const [readOptions, setReadOptions] = useState<Partial<ReadOptions>>(
    lastPreset?.readOptions || {
      voice: 0,
      speed: 100,
      interval: 100,
      volume: 100,
    },
  )
  const [subTitle, setSubTitle] = useState<string>(lastPreset?.subTitle || '')
  const [frameRate, setFrameRate] = useState(60)
  return (
    <StatusChecker>
      <SofTalkContext.Provider
        value={{
          readOptions,
          setReadOptions,
          subTitle,
          setSubTitle,
          frameRate,
          setFrameRate,
        }}
      >
        <Presets />
        <Tabs>
          <TabList>
            <Tab>テキスト</Tab>
            <Tab>読み上げ設定</Tab>
            <Tab>字幕設定</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Controller />
            </TabPanel>
            <TabPanel>
              <Options />
            </TabPanel>
            <TabPanel>
              <SubTitles />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SofTalkContext.Provider>
    </StatusChecker>
  )
}

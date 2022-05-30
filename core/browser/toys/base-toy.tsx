import type { ConfigurationType } from '@aviutil-toys/api'
import { api, ToyContextType } from '@aviutil-toys/api/client'
import { Code, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useErrorModal } from '../components/error-modal'
import { Constants } from '../constants'

import { ToyContainer } from '@/browser/toys/toy-container'

export const BaseToy: React.FC<ToyContextType> = ({ component: C, ...rest }) => {
  const showErrorModal = useErrorModal()
  const navigate = useNavigate()

  const checkMissingConfig = async () => {
    const config = await api.invoke('config:get')
    const missing = (rest.essentialConfig &&
      config &&
      rest.essentialConfig.filter(
        (v) => !Object.keys(config).includes(v),
      )) as (keyof ConfigurationType)[]
    if (missing && missing.length > 0) {
      showErrorModal(
        `Missing configuration: ${missing.join(', ')}`,
        <>
          <Text>{`この機能を使用するには次の項目の設定が必要です。`}</Text>
          <Code>{missing.map((v) => Constants.configuration.keyMap[v]).join(', ')}</Code>
        </>,
        () => {
          navigate(-1)
        },
      )
    }
  }

  useEffect(() => {
    if (
      window.location.pathname !==
      `/toys/${rest.parentPlugin ? `${rest.parentPlugin}/` : ''}${rest.id}`
    ) {
      checkMissingConfig()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.essentialConfig, rest.id, rest.parentPlugin])

  return (
    <ToyContainer {...rest}>
      <C />
    </ToyContainer>
  )
}

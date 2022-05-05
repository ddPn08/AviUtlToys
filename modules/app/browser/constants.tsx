import { ConfigurationType } from '@aviutil-toys/api'

type Constants = {
  configuration: {
    keyMap: Record<keyof ConfigurationType, string>
  }
}
export const Constants: Constants = {
  configuration: {
    keyMap: {
      aviutilDir: 'Aviutilのフォルダ',
    },
  },
}

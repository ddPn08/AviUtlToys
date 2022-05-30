import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from '@chakra-ui/react'
import { useContext } from 'react'

import { SofTalkContext } from '..'

import { VoiceNumberMap } from '@/types'

export const Options: React.FC = () => {
  const { readOptions, setReadOptions } = useContext(SofTalkContext)
  return (
    <Box>
      <FormControl>
        <Stack spacing={2}>
          <FormLabel>声</FormLabel>
          <Select
            value={readOptions.voice}
            onChange={(e) =>
              setReadOptions({
                ...readOptions,
                voice: parseInt(e.target.value, 0),
              })
            }
          >
            {Object.entries(VoiceNumberMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>

          <FormLabel>音量</FormLabel>
          <Grid gap="2" gridTemplateColumns="1fr 100px">
            <Slider
              aria-label="speed-slider"
              value={readOptions.volume || 100}
              onChange={(v) => {
                setReadOptions({
                  ...readOptions,
                  volume: v,
                })
              }}
              max={100}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Input
              type="number"
              value={readOptions.volume}
              onChange={(e) => {
                setReadOptions({
                  ...readOptions,
                  volume: parseInt(e.target.value || '0'),
                })
              }}
            />
          </Grid>

          <FormLabel>速さ</FormLabel>
          <Grid gap="2" gridTemplateColumns="1fr 100px">
            <Slider
              aria-label="speed-slider"
              value={readOptions.speed || 100}
              onChange={(v) => {
                setReadOptions({
                  ...readOptions,
                  speed: v,
                })
              }}
              max={300}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Input
              type="number"
              value={readOptions.speed}
              onChange={(e) => {
                setReadOptions({
                  ...readOptions,
                  speed: parseInt(e.target.value || '0'),
                })
              }}
            />
          </Grid>

          <FormLabel>音程</FormLabel>
          <Grid gap="2" gridTemplateColumns="1fr 100px">
            <Slider
              aria-label="speed-slider"
              value={readOptions.interval || 100}
              onChange={(v) => {
                setReadOptions({
                  ...readOptions,
                  interval: v,
                })
              }}
              max={200}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Input
              type="number"
              value={readOptions.interval}
              onChange={(e) => {
                setReadOptions({
                  ...readOptions,
                  interval: parseInt(e.target.value || '0'),
                })
              }}
            />
          </Grid>
        </Stack>
      </FormControl>
    </Box>
  )
}

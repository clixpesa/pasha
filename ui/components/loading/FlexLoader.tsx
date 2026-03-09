import React from 'react'
import type { ViewProps } from 'react-native'
import { Stack, StackProps } from "tamagui"

export type FlexLoaderProps = { repeat?: number } & StackProps & ViewProps

export function FlexLoader({
  repeat = 1,
  bg = '$neutral3',
  rounded = '$md',
  width = '100%',
  height,
  ...props
}: FlexLoaderProps): React.JSX.Element {
  return (
    <Stack className="FlexLoader">
      {new Array(repeat).fill(null).map((_, i) => (
        <React.Fragment key={i}>
          <Stack
            bg={bg}
            rounded={rounded}
            height={height}
            width={width}
            {...props}
          />
        </React.Fragment>
      ))}
    </Stack>
  )
}

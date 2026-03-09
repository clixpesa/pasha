import React from 'react'
import { Stack, StackProps } from "tamagui"

export function NftCardLoader(props: StackProps): React.JSX.Element {
  return (
    <Stack flex={1} content="flex-start" m="$space.2xs" {...props}>
      <Stack aspectRatio={1} bg="$neutral3" rounded="$md" width="100%" />
    </Stack>
  )
}

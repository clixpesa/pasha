import { Text } from '@/ui/components/text/Text'
import type { JSX } from 'react'
import { Stack, XStack } from 'tamagui'

interface Props {
  opacity: number
}

export const ADDRESS_WRAPPER_HEIGHT = 36

export function WalletLoader({ opacity }: Props): JSX.Element {
  return (
    <XStack
      items="center"
      borderColor="$neutral3"
      rounded="$vl"
      borderWidth={1}
      content="flex-start"
      opacity={opacity}
      overflow="hidden"
      px="$md"
      py="$md"
      className="WalletLoader"
    >
      <XStack items="center" gap="$sm" height={ADDRESS_WRAPPER_HEIGHT}>
        <Stack bg="$neutral3" rounded="$full" height={32} width={32} />
        <Stack items="flex-start" width="100%">
          <Text loading loadingPlaceholderText="Wallet Nickname" variant="body1" />
          <Text loading loadingPlaceholderText="0xaaaa...aaaa" variant="subHeading2" />
        </Stack>
      </XStack>
    </XStack>
  )
}

import { useDeviceDimensions } from '@/ui/hooks/useDeviceDimensions/useDeviceDimensions'
import { fonts } from '@/ui/theme/fonts'
import React, { memo, useMemo } from 'react'
import { getToken, SpaceTokens, Stack, XStack } from 'tamagui'
import { ActivityLoader } from './ActivityLoader'
import { FlexLoader, FlexLoaderProps } from './FlexLoader'
import { NftCardLoader } from './NftCardLoader'
import { Skeleton } from './Skeleton'
import { TokenLoader } from './TokenLoader'
import { TransactionLoader } from './TransactionLoader'
import { WalletLoader } from './WalletLoader'

const Transaction = memo(function _Transaction({ repeat = 1 }: { repeat?: number }): React.JSX.Element {
  return (
    <Skeleton>
      <Stack >
        {new Array(repeat).fill(null).map((_, i, { length }) => (
          <React.Fragment key={i}>
            <TransactionLoader opacity={(length - i) / length} withAmounts/>
          </React.Fragment>
        ))}
      </Stack>
    </Skeleton>
  )
})

const Activity = memo(function _Activity({ repeat = 1 }: { repeat?: number }): React.JSX.Element {
  return (
    <Skeleton>
      <Stack>
        {new Array(repeat).fill(null).map((_, i, { length }) => (
          <React.Fragment key={i}>
            <ActivityLoader opacity={(length - i) / length} />
          </React.Fragment>
        ))}
      </Stack>
    </Skeleton>
  )
})

/**
 * Loader used for search results e.g. search, recipient etc...
 */
const SearchResult = memo(function _SearchResult({ repeat = 1 }: { repeat?: number }): React.JSX.Element {
  return <Activity repeat={repeat} />
})

const TransferProvider = memo(function _TransferProvider({
  itemsCount,
  iconSize,
}: {
  itemsCount: number
  iconSize: number
}): React.JSX.Element {
  const { fullWidth } = useDeviceDimensions()
  const LINKED_TEXT_WIDTH = 40
  return (
    <Stack>
      {new Array(itemsCount).fill(null).map((_, i) => (
        <XStack key={i} items="center" gap="$sm" mb="$sm" mx="$vs" p="$md">
          <XStack flex={1} items="center" gap="$sm">
            <Loader.Box rounded="$md" height={iconSize} width={iconSize} />
            <Loader.Box rounded="$xs" height={fonts.body3.lineHeight} width={fullWidth / 3} />
          </XStack>
          <Loader.Box rounded="$xs" height={fonts.body3.lineHeight} width={LINKED_TEXT_WIDTH} />
        </XStack>
      ))}
    </Stack>
  )
})

function Box(props: FlexLoaderProps): React.JSX.Element {
  return (
    <Skeleton>
      <FlexLoader {...props} />
    </Skeleton>
  )
}

function Token({
  repeat = 1,
  contrast,
  withPrice,
  gap = '$2xs',
}: {
  repeat?: number
  contrast?: boolean
  withPrice?: boolean
  gap?: SpaceTokens
}): React.JSX.Element {
  return (
    <Skeleton contrast={contrast}>
      <Stack flex={1} gap={gap}>
        {new Array(repeat).fill(null).map((_, i, { length }) => (
          <React.Fragment key={i}>
            <TokenLoader opacity={(length - i) / length} withPrice={withPrice} />
          </React.Fragment>
        ))}
      </Stack>
    </Skeleton>
  )
}

function NFT({ repeat = 1 }: { repeat?: number }): React.JSX.Element {
  const loader = useMemo(
    () =>
      repeat === 1 ? (
        <NftCardLoader opacity={1} />
      ) : (
        <Stack >
          {new Array(Math.floor(repeat / 2)).fill(null).map((_, i, { length }) => {
            const opacity = (length - i) / length
            return (
              <XStack key={i}>
                <NftCardLoader opacity={opacity} width="50%" />
                <NftCardLoader opacity={opacity} width="50%" />
              </XStack>
            )
          })}
        </Stack>
      ),
    [repeat],
  )

  return <Skeleton>{loader}</Skeleton>
}

function Image(): React.JSX.Element {
  return (
    <Skeleton>
      <FlexLoader aspectRatio={1} rounded={getToken('$none', 'radius')} />
    </Skeleton>
  )
}

function Wallets({ repeat = 1 }: { repeat?: number }): React.JSX.Element {
  return (
    <Skeleton>
      <Stack gap="$sm" ml="$lg">
        {new Array(repeat).fill(null).map((_, i, { length }) => (
          <React.Fragment key={i}>
            <WalletLoader opacity={(length - i) / length} />
          </React.Fragment>
        ))}
      </Stack>
    </Skeleton>
  )
}

export const Loader = {
  Box,
  NFT,
  Image,
  Activity,
  SearchResult,
  Token,
  TransferProvider,
  Transaction,
  Wallets,
}

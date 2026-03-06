import { isWeb } from '@/utilities/platform'
import { Stack, styled } from 'tamagui'

export const Separator = styled(Stack, {
  name: 'Separator',
  borderColor: '$surface3',
  shrink: 0,
  borderWidth: 0,
  flex: 1,
  height: 0,
  maxH: 0,
  borderBottomWidth: 1,

  variants: {
    test: {
      ok: {},
    },

    vertical: {
      true: {
        y: 0,
        // `as any` because its valid only on web
        // biome-ignore lint/suspicious/noExplicitAny: Web-specific CSS value requires type override
        height: isWeb ? ('initial' as any) : 'auto',
        // `as any` because its valid only on web
        // biome-ignore lint/suspicious/noExplicitAny: Web-specific CSS value requires type override
        maxHeight: isWeb ? ('initial' as any) : 'auto',
        width: 0,
        maxWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0.25,
      },
    },
  } as const,
})

Separator.displayName = 'Separator'

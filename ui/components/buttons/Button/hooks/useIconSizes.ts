import { useMemo } from 'react'
import { getTokenValue } from 'tamagui'
import { IconButtonProps } from '../../IconButton/IconButton'
import { lineHeights } from '../constants'
import type { ButtonProps, TypeOfButton } from '../types'
import { getLineHeightForButtonFontTokenKey } from '../utils/getLineHeightForButtonFontTokenKey'

type Size = NonNullable<ButtonProps['size'] | IconButtonProps['size']>

// These are special as they're mapped to the size of the font within the button
const getIconSizesForButton = (): Record<Size, number> => ({
  "2xs": getLineHeightForButtonFontTokenKey(lineHeights['2xs']),
  xs: getLineHeightForButtonFontTokenKey(lineHeights.xs),
  sm: getLineHeightForButtonFontTokenKey(lineHeights.sm),
  md: getLineHeightForButtonFontTokenKey(lineHeights.md),
  lg: getLineHeightForButtonFontTokenKey(lineHeights.lg),
})

// These are more straightforward
const getIconSizesForIconButton = (): Record<Size, number> => ({
  "2xs": getTokenValue('$icon.3xs'),
  xs: getTokenValue('$icon.3xs'),
  sm: getTokenValue('$icon.xs'),
  md: getTokenValue('$icon.vs'),
  lg: getTokenValue('$icon.vs'),
})

// We declare this because there could potentially be a race condition where `getConfig()` is called before the tamagui config is initialized
// So, we create `getIconSizes` and wrap is with `useMemo` so it's used when the component actually needs it
export const useIconSizes = (
  typeOfButton: TypeOfButton,
): ReturnType<typeof getIconSizesForButton | typeof getIconSizesForIconButton> =>
  useMemo(() => {
    if (typeOfButton === 'button') {
      return getIconSizesForButton()
    }

    return getIconSizesForIconButton()
  }, [typeOfButton])

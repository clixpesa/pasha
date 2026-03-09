import { getContrastPassingTextColor } from '@/ui/utils/colors'
import { Text, styled } from 'tamagui'
import { buttonStyledContext, lineHeights } from '../../constants'
import type { ButtonEmphasis, ButtonVariantProps } from '../../types'
import { getMaybeHexOrRGBColor } from '../../utils/getMaybeHexOrRGBColor'
import { variantEmphasisHash } from './variantEmphasisHash'

/**
 * This component is used to render the text/label within our `Button` component.
 * @props color - The color of the text. If passed as HEX or RGBA, the text will use that color for all of its HTML Element states (i.e. hover, active, etc.), overriding the `emphasis` and `variant` prop.
 * @props custom-background-color - The background color of the `Button` this `CustomButtonText` is a child of. If passed, the text will use the contrast color of the background color for its hover state.
 * **NOTE:** this doesn't need to be passed explicitly if `CustomButtonText`, or `Button.Text`, is a child of a `Button` component has a `backgroundColor` prop passed to it..
 */
export const CustomButtonText = styled(Text, {
  context: buttonStyledContext,
  tag: 'span',
  fontFamily: '$button',
  color: '$color',
  maxFontSizeMultiplier: 1.2,
  numberOfLines: 1,
  variants: {
    variant: {
      // @ts-expect-error we know variant will be ButtonVariant
      ':string': (variant: Required<ButtonVariantProps>['variant'], { props }) => {
        // TODO(WEB-6347): change name back to `disabled`
        // @ts-expect-error we know isDisabled will be ButtonVariantProps['isDisabled']
        if (props.isDisabled) {
          return {
            color: '$neutral2',
          }
        }

        // @ts-expect-error we know 'custom-background-color' might be on `props` via `buttonStyledContext`, and if it is, it's a GetThemeValueForKey<'backgroundColor'> | OpaqueColorValue
        const customBackgroundColor = props['custom-bg']
        const maybeCustomColorProp = getMaybeHexOrRGBColor(props.color)

        const maybeButtonBackgroundCustomColor = getMaybeHexOrRGBColor(customBackgroundColor)

        if (maybeButtonBackgroundCustomColor) {
          return {
            color: getContrastPassingTextColor(maybeButtonBackgroundCustomColor),
          }
        }

        if (maybeCustomColorProp) {
          return {
            color: maybeCustomColorProp,
            '$group-hover': {
              color: maybeCustomColorProp,
            },
          }
        }

        const emphasis =
          // @ts-expect-error we know emphasis will be ButtonEmphasis
          (props.emphasis || 'primary') as NonNullable<ButtonEmphasis>

        return variantEmphasisHash[variant][emphasis]
      },
    },
    // these are taken from Figma and mapped to the values in fonts.ts > buttonFont
    // https://github.com/Uniswap/universe/blob/main/packages/ui/src/theme/fonts.ts
    size: {
      "2xs": {
        fontSize: '$xs',
        fontWeight: '$md',
        lineHeight: lineHeights["2xs"],
      },
      xs: {
        fontSize: '$xs',
        fontWeight: '$md',
        lineHeight: lineHeights.xs,
      },
      sm: {
        fontSize: '$sm',
        fontWeight: '$md',
        lineHeight: lineHeights.sm,
      },
      md: {
        fontSize: '$md',
        fontWeight: '$md',
        lineHeight: lineHeights.md,
      },
      lg: {
        fontSize: '$lg',
        fontWeight: '$md',
        lineHeight: lineHeights.lg,
      },
    },
  } as const,
})

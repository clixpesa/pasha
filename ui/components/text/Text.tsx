import { Flex } from '@/ui/components/layout'
import { HiddenFromScreenReaders } from '@/ui/components/text/HiddenFromScreenReaders'
import { useEnableFontScaling } from '@/ui/components/text/useEnableFontScaling'
import { Skeleton } from '@/ui/components/loading/Skeleton'
import { fonts } from '@/ui/theme/fonts'
import { isWeb } from '@/utilities/platform'
import React, { PropsWithChildren } from 'react'
import { GetProps, styled, Text as TamaguiText } from 'tamagui'

export const TextFrame = styled(TamaguiText, {
  fontFamily: '$body',
  wordWrap: 'break-word',

  variants: {
    variant: {
      heading1: {
        fontFamily: '$heading',
        fontSize: "$lg",
        lineHeight: '$lg',
        fontWeight: '$rg',
        maxFontSizeMultiplier: fonts.heading1.maxFontSizeMultiplier,
      },
      heading2: {
        fontFamily: '$heading',
        fontSize: '$md',
        lineHeight: '$md',
        fontWeight: '$rg',
        maxFontSizeMultiplier: fonts.heading2.maxFontSizeMultiplier,
      },
      heading3: {
        fontFamily: '$heading',
        fontSize: '$sm',
        lineHeight: '$sm',
        fontWeight: '$rg',
        maxFontSizeMultiplier: fonts.heading3.maxFontSizeMultiplier,
      },
      subHeading1: {
        fontFamily: '$subHeading',
        fontSize: '$lg',
        lineHeight: '$lg',
        fontWeight: '$md',
        maxFontSizeMultiplier: fonts.subHeading1.maxFontSizeMultiplier,
      },
      subHeading2: {
        fontFamily: '$subHeading',
        fontSize: '$sm',
        lineHeight: '$sm',
        fontWeight: '$md',
        maxFontSizeMultiplier: fonts.subHeading2.maxFontSizeMultiplier,
      },
      body1: {
        fontFamily: '$body',
        fontSize: '$lg',
        lineHeight: '$lg',
        fontWeight: '$rg',
        maxFontSizeMultiplier: fonts.body1.maxFontSizeMultiplier,
      },
      body2: {
        fontFamily: '$body',
        fontSize: '$md',
        lineHeight: '$md',
        fontWeight: '$rg',
        maxFontSizeMultiplier: fonts.body2.maxFontSizeMultiplier,
      },
      body3: {
        fontFamily: '$body',
        fontSize: '$sm',
        lineHeight: '$sm',
        fontWeight: '$rg',
        maxFontSizeMultiplier: fonts.body3.maxFontSizeMultiplier,
      },
      body4: {
        fontFamily: '$body',
        fontSize: '$xs',
        lineHeight: '$xs',
        fontWeight: '$md',
        maxFontSizeMultiplier: fonts.body4.maxFontSizeMultiplier,
      },
      buttonLabel1: {
        fontFamily: '$button',
        fontSize: '$lg',
        lineHeight: '$lg',
        fontWeight: '$md',
        maxFontSizeMultiplier: fonts.buttonLabel1.maxFontSizeMultiplier,
      },
      buttonLabel2: {
        fontFamily: '$button',
        fontSize: '$md',
        lineHeight: '$md',
        fontWeight: '$md',
        maxFontSizeMultiplier: fonts.buttonLabel2.maxFontSizeMultiplier,
      },
      buttonLabel3: {
        fontFamily: '$button',
        fontSize: '$sm',
        lineHeight: '$sm',
        fontWeight: '$md',
        maxFontSizeMultiplier: fonts.buttonLabel3.maxFontSizeMultiplier,
      },
      buttonLabel4: {
        fontFamily: '$button',
        fontSize: '$xs',
        lineHeight: '$xs',
        fontWeight: '$md',
        maxFontSizeMultiplier: fonts.buttonLabel4.maxFontSizeMultiplier,
      },
      monospace: {
        fontFamily: '$body',
        fontSize: fonts.monospace.fontSize,
        lineHeight: fonts.monospace.lineHeight,
        fontWeight: '$rg',
        maxFontSizeMultiplier: fonts.monospace.maxFontSizeMultiplier,
      },
    },
  } as const,

  defaultVariants: {
    variant: 'body2',
  },
})

TextFrame.displayName = 'TextFrame'

const Heading1 = styled(TextFrame, {
  tag: 'h1',
})

Heading1.displayName = 'Heading1'

const Heading2 = styled(TextFrame, {
  tag: 'h2',
})

Heading2.displayName = 'Heading2'

const Heading3 = styled(TextFrame, {
  tag: 'h3',
})

Heading3.displayName = 'Heading3'

type TextFrameProps = GetProps<typeof TextFrame>

export type TextProps = TextFrameProps & {
  maxFontSizeMultiplier?: number
  allowFontScaling?: boolean
  loading?: boolean | 'no-shimmer'
  loadingPlaceholderText?: string
  title?: string
}

// Use this text component throughout the app instead of
// Default RN Text for theme support

export const TextPlaceholder = ({ children }: PropsWithChildren<unknown>): React.JSX.Element => {
  return (
    <Flex row items="center" testID="text-placeholder">
      <Flex row items="center" position="relative">
        <HiddenFromScreenReaders>{children}</HiddenFromScreenReaders>
        <Flex
          bg={isWeb ? '$surface3' : '$surface2'}
          rounded="$full"
          b="5%"
          l={0}
          position="absolute"
          r={0}
          t="5%"
        />
      </Flex>
    </Flex>
  )
}

export const TextLoaderWrapper = ({
  children,
  loadingShimmer,
}: { loadingShimmer?: boolean } & PropsWithChildren<unknown>): React.JSX.Element => {
  const inner = <TextPlaceholder>{children}</TextPlaceholder>
  if (loadingShimmer) {
    return <Skeleton>{inner}</Skeleton>
  }

  return inner
}

const TEXT_COMPONENTS = {
  heading1: Heading1,
  heading2: Heading2,
  heading3: Heading3,
} as const

const getTextComponent = (variant: TextProps['variant']): typeof TextFrame => {
   
  return TEXT_COMPONENTS[variant as keyof typeof TEXT_COMPONENTS] ?? TextFrame
}

/**
 * Use this component instead of the default React Native <Text> component anywhere text shows up throughout the app, so we can use the design system values for colors and sizes, and make sure all text looks and behaves the same way
 * @param loading Whether the text inside the component is still loading or not. Set this to true if whatever content goes inside the <Text> component is coming from a variable that might still be loading. This prop is optional and defaults to false. This prop can also be set to "no-shimmer" to enable a loading state without the shimmer effect.
 * @param loadingPlaceholderText - The text that the loader's size will be derived from. Pick something that's close to the same length as the final text is expected to be, e.g. if it's a ticker symbol, "XXX" might be a good placeholder text. This prop is optional and defaults to "000.00".
 */
export const Text = TextFrame.styleable<TextProps>(
  ({ loading = false, allowFontScaling, loadingPlaceholderText = '000.00', ...rest }) => {
    const enableFontScaling = useEnableFontScaling(allowFontScaling)
    const TextComponent = getTextComponent(rest.variant)

    if (loading) {
      return (
        <TextLoaderWrapper loadingShimmer={loading !== 'no-shimmer'}>
          <TextComponent allowFontScaling={enableFontScaling} color="$transparent" opacity={0} {...rest}>
            {/* Important that `children` isn't used or rendered by <Text> when `loading` is true, because if the child of a <Text> component is a dynamic variable that might not be finished fetching yet, it'll result in an error until it's finished loading. We use `loadingPlaceholderText` to set the size of the loading element instead. */}
            {loadingPlaceholderText}
          </TextComponent>
        </TextLoaderWrapper>
      )
    }

    return <TextComponent allowFontScaling={enableFontScaling} color="$neutral1" {...rest} />
  },
)

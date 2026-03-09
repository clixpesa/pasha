import { FOCUS_SCALE } from '@/ui/components/buttons/Button/constants'
import { withCommonPressStyle } from '@/ui/components/buttons/Button/utils/withCommonPressStyle'
import { isWeb } from '@/utilities/platform'
import { YStack, styled, type YStackProps } from 'tamagui'

type TouchableAreaVariant = 'unstyled' | 'none' | 'outlined' | 'filled' | 'raised' | 'floating'

// This comes from the `hoverable` variant of the `TouchableAreaFrame`
// But it can't circularly reference itself, so we need to define it here
type PropsWithHoverableAndDisabled = {
  props: {
    hoverable?: boolean
    disabled?: boolean
  }
}

export const TouchableAreaFrame = styled(YStack, {
  name: 'TouchableArea',
  tag: 'div',
  role: 'button',
  group: true,
  animation: 'simple',
  animateOnly: ['transform', 'opacity'],
  pressStyle: withCommonPressStyle({}),
  rounded: '$md',
  bg: '$transparent',
  '$platform-web': {
    containerType: 'normal',
  },
  focusVisibleStyle: {
    scaleX: FOCUS_SCALE,
    scaleY: FOCUS_SCALE,
    outlineWidth: 1,
    outlineOffset: 1,
    outlineStyle: 'solid',
  },
  cursor: 'pointer',
  variants: {
    centered: {
      true: {
        items: 'center',
        justify: 'center',
      },
    },
    row: {
      true: {
        flexDirection: 'row',
      },
      false: {
        flexDirection: 'column',
      },
    },
    disabled: {
      true: {
        'aria-disabled': true,
        userSelect: 'none',
        opacity: 0.6,
        pointerEvents: 'box-none',
        tabIndex: -1,
        cursor: 'default',
        '$platform-web': {
          pointerEvents: 'none',
        },
      },
    },
    hoverable: {
      // when true, `hoverStyle` is applied via the variant
      true: {},
      // when false, `hoverStyle` is disabled
      false: {
        hoverStyle: undefined,
      },
    },
    variant: {
      unstyled: {
        pressStyle: {
          scale: 1,
        },
        focusVisibleStyle: {
          outlineColor: '$neutral3',
        },
      },
      none: (_: unknown, { props: { hoverable } }: PropsWithHoverableAndDisabled): Partial<YStackProps> => ({
        hoverStyle: hoverable
          ? {
              bg: '$surface2Hovered',
            }
          : undefined,
        focusVisibleStyle: {
          bg: '$surface2Hovered',
          outlineColor: '$neutral3',
        },
      }),
      outlined: (_: unknown, { props: { hoverable } }: PropsWithHoverableAndDisabled): Partial<YStackProps> => ({
        borderWidth: 1,
        borderColor: '$surface3',
        hoverStyle: hoverable
          ? {
              borderColor: '$surface3Hovered',
              bg: '$surface2Hovered',
            }
          : undefined,
        focusVisibleStyle: {
          borderColor: '$surface3Hovered',
          bg: '$surface2Hovered',
          outlineColor: '$neutral3',
        },
      }),
      filled: (_: unknown, { props: { hoverable } }: PropsWithHoverableAndDisabled): Partial<YStackProps> => ({
        bg: '$surface3',
        hoverStyle: hoverable
          ? {
              borderColor: '$surface3Hovered',
              bg: '$surface3Hovered',
            }
          : undefined,
        focusVisibleStyle: {
          borderColor: '$surface3Hovered',
          bg: '$surface3Hovered',
          outlineColor: '$neutral3',
        },
      }),
      raised: (_: unknown, { props: { hoverable, disabled } }: PropsWithHoverableAndDisabled): Partial<YStackProps> => {
        return {
          // We can't nest `$theme-[dark/light]` within `$platform-web` because Tamagui doesn't support it
          '$theme-dark': {
            boxShadow: disabled
              ? undefined
              : isWeb
                ? `0px 1px 6px 2px rgba(0, 0, 0, 0.54), 0px 1px 2px 0px rgba(0, 0, 0, 0.40)`
                : undefined,
            shadowColor: disabled ? undefined : isWeb ? 'rgba(0, 0, 0, 0.40)' : undefined,
          },
          '$theme-light': {
            boxShadow: disabled
              ? undefined
              : isWeb
                ? `0px 1px 6px 2px rgba(0, 0, 0, 0.03), 0px 1px 2px 0px rgba(0, 0, 0, 0.02)`
                : undefined,
            shadowColor: disabled ? undefined : isWeb ? 'rgba(0, 0, 0, 0.02)' : undefined,
          },
          '$platform-native': disabled
            ? {}
            : {
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                shadowColor: '$black',
              },
          '$platform-android': disabled
            ? {}
            : {
                elevation: 1,
              },
          borderWidth: 1,
          borderColor: '$surface3',
          hoverStyle: hoverable
            ? {
                borderColor: '$surface3Hovered',
              }
            : undefined,
          focusVisibleStyle: {
            borderColor: '$surface3Hovered',
            outlineColor: '$neutral3',
          },
          bg: disabled ? '$surface2' : undefined,
        }
      },
      floating: (_: unknown, { props: { hoverable } }: PropsWithHoverableAndDisabled): Partial<YStackProps> => ({
        bg: '$surface5',
        '$platform-web': {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)', // for Safari
        },
        hoverStyle: hoverable
          ? {
              bg: '$surface5Hovered',
            }
          : undefined,
        focusVisibleStyle: {
          bg: '$surface5Hovered',
          outlineColor: '$neutral3',
        },
      }),
    } as Record<NonNullable<TouchableAreaVariant>, Partial<YStackProps>>,
  } as const,
  defaultVariants: {
    variant: 'none',
    centered: false,
    hoverable: true,
    row: false,
  },
})

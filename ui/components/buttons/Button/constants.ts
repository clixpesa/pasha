import { createStyledContext, type GetThemeValueForKey, type XStackProps } from 'tamagui'
import type { ButtonVariantProps } from './types'

// this ensures that the variant can be passed to the frame but will also thread down to the inner text
export const buttonStyledContext = createStyledContext<ButtonVariantProps>({
  size: 'md',
  variant: 'default',
  emphasis: 'primary',
  isDisabled: false,
  'custom-bg': undefined,
})

export const lineHeights = {
  "2xs": '$xs',
  xs: '$sm',
  sm: '$sm',
  md: '$lg',
  lg: '$lg',
} satisfies Record<Required<ButtonVariantProps>['size'], GetThemeValueForKey<'lineHeight'>>

export const lineHeightFallbacks: Record<'$xs' | '$sm' | '$md' | '$lg', number> = {
  $xs: 16,
  $sm: 16,
  $md: 20,
  $lg: 24,
} as const

export const FOCUS_SCALE = 0.98
export const PRESS_SCALE = FOCUS_SCALE

export const defaultFocusVisibleStyle = {
  outlineColor: '$neutral3Hovered',
} satisfies XStackProps['focusVisibleStyle']

export const brandedFocusVisibleStyle = {
  outlineColor: '$accent1Hovered',
} satisfies XStackProps['focusVisibleStyle']

export const criticalFocusVisibleStyle = {
  outlineColor: '$statusCriticalHovered',
} satisfies XStackProps['focusVisibleStyle']

export const warningFocusVisibleStyle = {
  outlineColor: '$statusWarningHovered',
} satisfies XStackProps['focusVisibleStyle']

export const commonPressStyle = {
  scale: PRESS_SCALE,
} satisfies XStackProps['pressStyle']

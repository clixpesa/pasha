import { TextProps } from 'tamagui'
import type { ButtonEmphasis, ButtonVariant } from '../../types'

type TextStyleLookup = {
  [variant in ButtonVariant]: {
    [emphasis in ButtonEmphasis]: Pick<TextProps, 'color' | '$group-hover'>
  }
}

export const variantEmphasisHash: TextStyleLookup = {
  branded: {
    primary: {
      color: '$white',
    },
    secondary: {
      color: '$accent1',
      '$group-hover': {
        color: '$accent1Hovered',
      },
    },
    tertiary: {
      color: '$accent1',
      '$group-hover': {
        color: '$accent1Hovered',
      },
    },
    'text-only': {
      color: '$accent1',
      '$group-hover': {
        color: '$accent1Hovered',
      },
    },
  },
  critical: {
    primary: {
      color: '$white',
    },
    secondary: {
      color: '$statusCritical',
      '$group-hover': {
        color: '$statusCriticalHovered',
      },
    },
    tertiary: {
      color: '$statusCritical',
      '$group-hover': {
        color: '$statusCriticalHovered',
      },
    },
    'text-only': {
      color: '$statusCritical',
      '$group-hover': {
        color: '$statusCriticalHovered',
      },
    },
  },
  warning: {
    primary: {
      color: '$surface1',
      '$group-hover': {
        color: '$surface1Hovered',
      },
    },
    secondary: {
      color: '$statusWarning',
      '$group-hover': {
        color: '$statusWarningHovered',
      },
    },
    tertiary: {
      color: '$statusWarning',
      '$group-hover': {
        color: '$statusWarningHovered',
      },
    },
    'text-only': {
      color: '$statusWarning',
      '$group-hover': {
        color: '$statusWarningHovered',
      },
    },
  },
  default: {
    primary: {
      color: '$surface1',
      '$group-hover': {
        color: '$surface1Hovered',
      },
    },
    secondary: {
      color: '$neutral1',
      '$group-hover': {
        color: '$neutral1Hovered',
      },
    },
    tertiary: {
      color: '$neutral1',
      '$group-hover': {
        color: '$neutral1Hovered',
      },
    },
    'text-only': {
      color: '$neutral1',
      '$group-hover': {
        color: '$neutral1Hovered',
      },
    },
  },
}

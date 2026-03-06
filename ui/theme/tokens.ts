import { type ColorTokens, createTokens } from "tamagui";
import type { DynamicColor } from "../hooks/useThemeColors";
import { colors as color } from "./colors";
import { fonts } from "./fonts";
import { themes } from "./themes";

const fontSize = {
	heading1: fonts.heading1.fontSize,
	heading2: fonts.heading2.fontSize,
	heading3: fonts.heading3.fontSize,
	subheading1: fonts.subheading1.fontSize,
	subheading2: fonts.subheading2.fontSize,
	body1: fonts.body1.fontSize,
	body2: fonts.body2.fontSize,
	body3: fonts.body3.fontSize,
	buttonLabel1: fonts.buttonLabel1.fontSize,
	buttonLabel2: fonts.buttonLabel2.fontSize,
	buttonLabel3: fonts.buttonLabel3.fontSize,
	buttonLabel4: fonts.buttonLabel4.fontSize,
	monospace: fonts.monospace.fontSize,
	true: fonts.body2.fontSize,
};

const iconSize = {
	"3xs": 16,
	"2xs": 18,
	xs: 20,
	vs: 24,
	sm: 28,
	md: 36,
	lg: 40,
	xl: 48,
	"2xl": 64,
	"3xl": 70,
	"4xl": 100,
	true: 40,
};

const imageSizes = {
	"3xs": 12,
	"2xs": 16,
	xs: 20,
	vs: 24,
	sm: 32,
	md: 36,
	lg: 40,
	xl: 48,
	"2xl": 64,
	"3xl": 100,
	true: 40,
};

const spacing = {
	none: 0,
	"4xs": 1,
	"3xs": 2,
	"2xs": 4,
	xs: 6,
	vs: 8,
	sm: 12,
	md: 16,
	lg: 18,
	vl: 20,
	xl: 24,
	"2xl": 32,
	"3xl": 36,
	"4xl": 40,
	"5xl": 48,
	"6xl": 60,
	true: 8,
};
export type IconSizeTokens = `$${keyof typeof iconSize}`;

export const tokens = createTokens({
	color,
	font: fontSize,
	icon: iconSize,
	image: imageSizes,
	space: spacing,
	size: spacing,
	radius: {
		none: 0,
		xs: 4,
		vs: 6,
		sm: 8,
		md: 12,
		lg: 16,
		vl: 20,
		xl: 24,
		"2xl": 32,
		"3xl": 36,
		full: 9999,
	},
	zIndex: {
		negative: -1,
		background: 0,
		default: 1,
		mask: 10,
		dropdown: 1000,
		sticky: 1020,
		fixed: 1030,
		modalBackdrop: 1040,
		offcanvas: 1050,
		modal: 1060,
		popoverBackdrop: 1065,
		popover: 1070,
		tooltip: 1080,
	},
});

/**
 * We have enabled allowedStyleValues: 'somewhat-strict-web' on createTamagui
 * which means our Tamagui components only accept valid tokens.
 *
 * But, sometimes we want to accept one-off values that aren't in the design system
 * especially as we migrate over.
 *
 * This is a way we can intentfully whitelist.

 */

// it would be a bit nicer if this was cast to Token
// but we'd need another new Tamagui release to support that (coming soon)

type ColorValue = DynamicColor | string | undefined | null

// Exported for testing
export const getIsTokenFormat = (value: string): boolean => {
  return value[0] === '$'
}

// Exported for testing
export const getIsValidSporeColor = (value: string): boolean => {
  if (getIsTokenFormat(value)) {
    const valueWithout$Prefix = value.slice(1)

    // check if in color tokens or theme:
    if (!(valueWithout$Prefix in color) && !(valueWithout$Prefix in themes.light)) {
      return false
    }

    return true
  }

  return false
}

// Exported for testing
export const validateColorValue = (value: ColorValue): { isValid: boolean; error?: Error } => {
  if (typeof value === 'string') {
    if (getIsTokenFormat(value)) {
      const isValidSporeColor = getIsValidSporeColor(value)

      if (isValidSporeColor) {
        return {
          isValid: true,
          error: undefined,
        }
      }

      return {
        isValid: true,
        error: undefined,
      }
    }

    if (
      value[0] !== '#' &&
      !value.startsWith('rgb(') &&
      !value.startsWith('rgba(') &&
      !value.startsWith('hsl(') &&
      !value.startsWith('hsla(') &&
      !value.startsWith('var(')
    ) {
      return {
        isValid: false,
        error: new Error(
          `Invalid color value: ${value} this helper just does a rough check so if this error is wrong you can update this check!`,
        ),
      }
    }
  }

  return {
    isValid: true,
    error: undefined,
  }
}

export const validColor = (value: ColorValue): ColorTokens | undefined => {
  if (process.env.NODE_ENV !== 'production') {
    const { isValid, error } = validateColorValue(value)

    if (!isValid) {
      throw error
    }
  }

  if (!value) {
    return undefined
  }

  return value as ColorTokens
}

/**
 * Returns the hover color token if it exists, otherwise returns the original color token passed in.
 *
 * @param {ColorValue} nonHoveredColor - The original color token.
 * @returns {ColorTokens} The hover color token if it exists, otherwise the original color token.
 */
export const getMaybeHoverColor = (nonHoveredColor: ColorValue): ColorTokens => {
  if (typeof nonHoveredColor === 'string' && getIsValidSporeColor(nonHoveredColor)) {
    const maybeHoveredColor = `${nonHoveredColor}Hovered`

    const isValidToken = getIsValidSporeColor(maybeHoveredColor)

    if (!isValidToken) {
      return nonHoveredColor as ColorTokens
    }

    return maybeHoveredColor as ColorTokens
  }

  return nonHoveredColor as unknown as ColorTokens
}

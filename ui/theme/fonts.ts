import { isWebApp } from "@/utilities/platform";
import { createFont, isAndroid, isWeb } from "@tamagui/core";


// TODO(EXT-148): remove this type and use Tamagui's FontTokens
export type TextVariantTokens = keyof typeof fonts

const adjustedSize = (fontSize: number): number => {
  if (isWebApp) {
    return fontSize
  }
  return fontSize + 1
}

// Note that React Native is a bit weird with fonts
// on iOS you must refer to them by the family name in the file
// on Android you must refer to them by the name of the file
// on web, it's the full family name in the file
const fontFamilyByPlatform = {
  android: {
    medium: "Inter-Medium",//'Basel-Grotesk-Medium',
    book: "Inter-Regular",//'Basel-Grotesk-Book',
  },
  ios: {
    medium: 'Basel Grotesk',
    book: 'Basel Grotesk',
  },
  web: {
    medium: "Inter Medium", //'Basel Grotesk Medium',
    book: "Inter Regular", //'Basel Grotesk Book',
  },
}

const platform = isWeb ? 'web' : isAndroid ? 'android' : 'ios'

const fontFamily = {
  serif: 'serif',
  sansSerif: {
    // iOS uses the name embedded in the font
    book: fontFamilyByPlatform[platform].book,
    medium: fontFamilyByPlatform[platform].medium,
    monospace: 'InputMono-Regular',
  },
}

const baselMedium = isWeb
  ? 'Basel, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  : fontFamily.sansSerif.medium

const baselBook = isWeb
  ? 'Basel, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  : fontFamily.sansSerif.book

type SansSerifFontFamilyKey = keyof typeof fontFamily.sansSerif
type SansSerifFontFamilyValue = (typeof fontFamily.sansSerif)[SansSerifFontFamilyKey]

const platformFontFamily = (family: SansSerifFontFamilyKey): SansSerifFontFamilyKey | SansSerifFontFamilyValue => {
  if (isWeb) {
    return family
  }

  return fontFamily.sansSerif[family]
}

// NOTE: these may not match the actual font weights in the figma files,
// but they are approved by design. If you want to change these or add new weights,
// please consult with the design team.

// default for non-button fonts
const BOOK_WEIGHT = '400'
const BOOK_WEIGHT_WEB = '485'

// used for buttons
const MEDIUM_WEIGHT = '500'
const MEDIUM_WEIGHT_WEB = '535'

const defaultWeights = {
  rg: isWebApp ? BOOK_WEIGHT_WEB : BOOK_WEIGHT,
  true: isWebApp ? BOOK_WEIGHT_WEB : BOOK_WEIGHT,
  md: isWebApp ? MEDIUM_WEIGHT_WEB : MEDIUM_WEIGHT,
}

// on native, the Basel font files render down a few px
// this adjusts them to be visually centered by default
export const NATIVE_LINE_HEIGHT_SCALE = 1.15

export const fonts = {
  heading1: {
    family: platformFontFamily('book'),
    fontSize: adjustedSize(52),
    lineHeight: adjustedSize(52) * 0.96,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.2,
    letterSpacing: '-2%',
  },

  heading2: {
    family: platformFontFamily('book'),
    fontSize: adjustedSize(36),
    lineHeight: 40,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.2,
    letterSpacing: '-1%',
  },
  heading3: {
    family: platformFontFamily('book'),
    fontSize: adjustedSize(24),
    lineHeight: adjustedSize(24) * 1.2,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.2,
    letterSpacing: '-0.5%',
  },
  subheading1: {
    family: platformFontFamily('book'),
    fontSize: adjustedSize(18),
    lineHeight: 24,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4,
  },
  subheading2: {
    family: platformFontFamily('book'),
    fontSize: adjustedSize(16),
    lineHeight: 20,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4,
  },
  body1: {
    family: platformFontFamily('book'),
    fontSize: adjustedSize(18),
    lineHeight: adjustedSize(18) * 1.3,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4,
  },
  body2: {
    family: platformFontFamily('book'),
    fontSize: adjustedSize(16),
    lineHeight: adjustedSize(16) * 1.3,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4,
  },
  body3: {
    family: platformFontFamily('book'),
    fontSize: adjustedSize(14),
    lineHeight: adjustedSize(14) * 1.3,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4,
  },
  body4: {
    family: platformFontFamily('book'),
    fontSize: adjustedSize(12),
    lineHeight: 16,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4,
  },
  buttonLabel1: {
    family: platformFontFamily('medium'),
    fontSize: adjustedSize(18),
    lineHeight: adjustedSize(18) * NATIVE_LINE_HEIGHT_SCALE,
    fontWeight: MEDIUM_WEIGHT,
    maxFontSizeMultiplier: 1.2,
  },
  buttonLabel2: {
    family: platformFontFamily('medium'),
    fontSize: adjustedSize(16),
    lineHeight: adjustedSize(16) * NATIVE_LINE_HEIGHT_SCALE,
    fontWeight: MEDIUM_WEIGHT,
    maxFontSizeMultiplier: 1.2,
  },
  buttonLabel3: {
    family: platformFontFamily('medium'),
    fontSize: adjustedSize(14),
    lineHeight: adjustedSize(14) * NATIVE_LINE_HEIGHT_SCALE,
    fontWeight: MEDIUM_WEIGHT,
    maxFontSizeMultiplier: 1.2,
  },
  buttonLabel4: {
    family: platformFontFamily('medium'),
    fontSize: adjustedSize(12),
    lineHeight: adjustedSize(12) * NATIVE_LINE_HEIGHT_SCALE,
    fontWeight: MEDIUM_WEIGHT,
    maxFontSizeMultiplier: 1.2,
  },
  monospace: {
    family: platformFontFamily('monospace'),
    fontSize: adjustedSize(12),
    lineHeight: 16,
    maxFontSizeMultiplier: 1.2,
  },
} as const

// TODO: Tamagui breaks font weights on Android if face *not* defined
// but breaks iOS if face is defined
const face = {
  [defaultWeights.rg]: { normal: baselBook },
  [defaultWeights.md]: { normal: baselMedium },
}

export const headingFont = createFont({
  family: baselBook,
  ...(isAndroid ? { face } : null),
  size: {
    sm: fonts.heading3.fontSize,
    md: fonts.heading2.fontSize,
    true: fonts.heading2.fontSize,
    lg: fonts.heading1.fontSize,
  },
  weight: defaultWeights,
  lineHeight: {
    sm: fonts.heading3.lineHeight,
    md: fonts.heading2.lineHeight,
    true: fonts.heading2.lineHeight,
    lg: fonts.heading1.lineHeight,
  },
})

export const subHeadingFont = createFont({
  family: baselBook,
  ...(isAndroid ? { face } : null),
  size: {
    sm: fonts.subheading2.fontSize,
    lg: fonts.subheading1.fontSize,
    true: fonts.subheading1.fontSize,
  },
  weight: defaultWeights,
  lineHeight: {
    sm: fonts.subheading2.lineHeight,
    lg: fonts.subheading1.lineHeight,
    true: fonts.subheading1.lineHeight,
  },
})

// for now tamagui is inferring all the font size from body, but we have differences in the diff fonts
// so i'm filling in blanks (adding medium here), but will need to fix this properly in tamagui...

export const bodyFont = createFont({
  family: baselBook,
  ...(isAndroid ? { face } : null),
  size: {
    xs: fonts.body4.fontSize,
    sm: fonts.body3.fontSize,
    md: fonts.body2.fontSize,
    true: fonts.body2.fontSize,
    lg: fonts.body1.fontSize,
  },
  weight: defaultWeights,
  lineHeight: {
    xs: fonts.body4.lineHeight,
    sm: fonts.body3.lineHeight,
    md: fonts.body2.lineHeight,
    true: fonts.body2.lineHeight,
    lg: fonts.body1.lineHeight,
  },
})

export const buttonFont = createFont({
  family: baselMedium,
  size: {
    xs: fonts.buttonLabel4.fontSize,
    sm: fonts.buttonLabel3.fontSize,
    md: fonts.buttonLabel2.fontSize,
    lg: fonts.buttonLabel1.fontSize,
    true: fonts.buttonLabel2.fontSize,
  },
  weight: {
    ...defaultWeights,
    true: MEDIUM_WEIGHT,
  },
  lineHeight: {
    xs: fonts.buttonLabel4.lineHeight,
    sm: fonts.buttonLabel3.lineHeight,
    md: fonts.buttonLabel2.lineHeight,
    lg: fonts.buttonLabel1.lineHeight,
    true: fonts.buttonLabel2.lineHeight,
  },
})

export const allFonts = {
  heading: headingFont,
  subHeading: subHeadingFont,
  body: bodyFont,
  button: buttonFont,
}

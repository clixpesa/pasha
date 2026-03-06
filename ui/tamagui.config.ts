import { media, mediaQueryDefaultActive, shorthands } from "@tamagui/config/v4";
import { createTamagui } from "@tamagui/core";
import { animations } from "./theme/animations";
import { allFonts } from "./theme/fonts";
import { themes } from "./theme/themes";
import { tokens } from "./theme/tokens";

export const config = createTamagui({
	animations,
	settings: {
    mediaQueryDefaultActive,
    defaultFont: 'body',
    fastSchemeChange: true,
    shouldAddPrefersColorThemes: true,
    allowedStyleValues: 'somewhat-strict-web',
    themeClassNameOnRoot: true,
    onlyAllowShorthands: true,
    maxDarkLightNesting: 2,
    disableSSR: true,
    autocompleteSpecificTokens: 'except-special',
  },
	media,
	shorthands,
	themes,
	tokens,
	fonts: allFonts,
});

export type TamaguiGroupNames = 'item' | 'card'

export type Conf = typeof config;

// ensure types work
declare module "tamagui" {
   
	interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'item' | 'card'
  }
}

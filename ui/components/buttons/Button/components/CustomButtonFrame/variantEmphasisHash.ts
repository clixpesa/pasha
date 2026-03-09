import type { XStackProps } from "tamagui";
import {
	brandedFocusVisibleStyle,
	criticalFocusVisibleStyle,
	defaultFocusVisibleStyle,
	warningFocusVisibleStyle,
} from "../../constants";
import type { ButtonEmphasis, ButtonVariant } from "../../types";
import { withCommonPressStyle } from "../../utils/withCommonPressStyle";

type ButtonStyleLookup = {
	[variant in ButtonVariant]: {
		[emphasis in ButtonEmphasis]: Pick<
			XStackProps,
			"bg" | "borderColor" | "hoverStyle" | "focusVisibleStyle" | "pressStyle"
		>;
	};
};

export const variantEmphasisHash: ButtonStyleLookup = {
	default: {
		primary: {
			bg: "$accent3",
			hoverStyle: {
				bg: "$accent3Hovered",
			},
			focusVisibleStyle: {
				bg: "$accent3Hovered",
				...defaultFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				bg: "$accent3Hovered",
			}),
		},
		secondary: {
			bg: "$surface3",
			hoverStyle: {
				bg: "$surface3Hovered",
			},
			focusVisibleStyle: {
				bg: "$surface3Hovered",
				...defaultFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				bg: "$surface3Hovered",
			}),
		},
		tertiary: {
			borderColor: "$surface3",
			hoverStyle: {
				borderColor: "$surface3Hovered",
			},
			focusVisibleStyle: {
				bg: "$surface1",
				...defaultFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				borderColor: "$surface3Hovered",
			}),
		},
		"text-only": {
			borderColor: "$transparent",
			focusVisibleStyle: defaultFocusVisibleStyle,
			pressStyle: withCommonPressStyle({
				borderColor: "$transparent",
			}),
		},
	},
	branded: {
		primary: {
			bg: "$accent1",
			hoverStyle: {
				bg: "$accent1Hovered",
			},
			focusVisibleStyle: {
				bg: "$accent1Hovered",
				...brandedFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				bg: "$accent1Hovered",
			}),
		},
		secondary: {
			bg: "$accent2",
			hoverStyle: {
				bg: "$accent2Hovered",
			},
			focusVisibleStyle: {
				bg: "$accent2Hovered",
				...brandedFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				bg: "$accent2Hovered",
			}),
		},
		tertiary: {
			borderColor: "$accent2",
			hoverStyle: {
				borderColor: "$accent2Hovered",
			},
			focusVisibleStyle: {
				bg: "$surface1",
				...brandedFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				borderColor: "$accent2Hovered",
			}),
		},
		"text-only": {
			borderColor: "$transparent",
			bg: "$transparent",
			focusVisibleStyle: {
				bg: "$surface1",
				...brandedFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				borderColor: "$transparent",
			}),
		},
	},
	critical: {
		primary: {
			bg: "$statusCritical",
			hoverStyle: {
				bg: "$statusCriticalHovered",
			},
			focusVisibleStyle: {
				bg: "$statusCriticalHovered",
				...criticalFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				bg: "$statusCriticalHovered",
			}),
		},
		secondary: {
			bg: "$statusCritical2",
			hoverStyle: {
				bg: "$statusCritical2Hovered",
			},
			focusVisibleStyle: {
				bg: "$statusCritical2Hovered",
				...criticalFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				bg: "$statusCritical2Hovered",
			}),
		},
		tertiary: {
			borderColor: "$statusCritical2",
			hoverStyle: {
				borderColor: "$statusCritical2Hovered",
			},
			focusVisibleStyle: {
				bg: "$surface1",
				...criticalFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				borderColor: "$statusCritical2Hovered",
			}),
		},
		"text-only": {
			borderColor: "$transparent",
			focusVisibleStyle: criticalFocusVisibleStyle,
			pressStyle: withCommonPressStyle({
				borderColor: "$transparent",
			}),
		},
	},
	warning: {
		primary: {
			bg: "$statusWarning",
			hoverStyle: {
				bg: "$statusWarningHovered",
			},
			focusVisibleStyle: {
				bg: "$statusWarningHovered",
				...warningFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				bg: "$statusWarningHovered",
			}),
		},
		secondary: {
			bg: "$statusWarning2",
			hoverStyle: {
				bg: "$statusWarning2Hovered",
			},
			focusVisibleStyle: {
				bg: "$statusWarning2Hovered",
				...warningFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				bg: "$statusWarning2Hovered",
			}),
		},
		tertiary: {
			borderColor: "$statusWarning2",
			hoverStyle: {
				borderColor: "$statusWarning2Hovered",
			},
			focusVisibleStyle: {
				bg: "$surface1",
				...warningFocusVisibleStyle,
			},
			pressStyle: withCommonPressStyle({
				borderColor: "$statusWarning2Hovered",
			}),
		},
		"text-only": {
			borderColor: "$transparent",
			focusVisibleStyle: warningFocusVisibleStyle,
			pressStyle: withCommonPressStyle({
				borderColor: "$transparent",
			}),
		},
	},
};

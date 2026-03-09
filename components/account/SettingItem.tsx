import {
	type IconProps,
	Text,
	View,
	XStack,
	YGroup,
	YStack,
	styled,
} from "@/ui";
import { RotatableChevron } from "@/ui/components/icons";
import type { ThemeName, YStackProps } from "tamagui";

export type SettingItemProps = YStackProps & {
	icon: React.FC<IconProps>;
	rightLabel?: string;
	accentTheme?: ThemeName;
	isActive?: boolean;
	rightIcon?: React.FC<IconProps>;
	rightComponent?: React.ReactNode;
};

export const SettingItem = ({
	icon: Icon,
	children,
	rightLabel,
	isActive,
	rightIcon: RIcon,
	rightComponent,
	accentTheme,
	...props
}: SettingItemProps) => {
	return (
		<YGroup.Item>
			<SettingItemFrame isActive={!!isActive} {...props}>
				<YStack theme={accentTheme}>
					<Icon opacity={0.9} size={24} />
				</YStack>
				<Text flex={1}>{children}</Text>
				{!!rightLabel && (
					<XStack rounded="$full" bg="$backgroundPress" px="$sm" py="$xs">
						<Text textTransform="capitalize">{rightLabel}</Text>
					</XStack>
				)}
				<RotatableChevron direction="right" />
				{!!rightComponent && <View>{rightComponent}</View>}
			</SettingItemFrame>
		</YGroup.Item>
	);
};

const SettingItemFrame = styled(XStack, {
	bg: "$surface1",
	items: "center",
	justify: "center",
	p: "$sm",
	gap: "$md",

	variants: {
		isActive: {
			true: {
				bg: "$backgroundFocus",
			},
			false: {
				hoverStyle: {
					bg: "$backgroundHover",
				},
				pressStyle: {
					bg: "$backgroundPress",
				},
			},
		},
	} as const,
});

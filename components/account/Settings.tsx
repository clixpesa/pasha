import { Text, XStack, YGroup, YStack, styled } from "@/ui";
import { withStaticProperties } from "tamagui";

import { SettingItem } from "./SettingItem";

const SettingsFrame = styled(YStack, {
	flex: 1,
	mx: "$lg",
});

const SettingsItems = styled(YStack, {
	gap: "$sm",

	"$platform-web": {
		gap: "$lg",
		m: "$lg",
		mx: "$lg",
	},
});

const SettingsGroup = styled(YGroup, {
	bg: "transparent",
	rounded: "$md",

	"$platform-native": {
		separator: (
			<XStack>
				<YStack width={20} />
				{/* <Separator borderColor="$color4" borderWidth="$0.25" /> */}
			</XStack>
		),
	},
});

const SettingsTitle = styled(Text, {
	ml: "$md",
	color: "$neutral2",
	variant: "subHeading2",
});

export const Settings = withStaticProperties(SettingsFrame, {
	Item: SettingItem,
	Items: SettingsItems,
	Group: SettingsGroup,
	Title: SettingsTitle,
});

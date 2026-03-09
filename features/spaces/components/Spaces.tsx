import { Text, YStack } from "@/ui";
import { YGroup, styled, withStaticProperties } from "tamagui";

import { SpaceItem } from "./SpaceItem";

const SpacesFrame = styled(YStack, {
	gap: "$md",
});

const SpacesItems = styled(YStack, {
	gap: "$lg",
});

const SpacesGroup = styled(YGroup, {
	gap: "$md",

	bg: "transparent",
});

const SpacesTitle = styled(Text, {
	fontWeight: "$md",
	mx: "$lg",
	color: "$neutral2",
});

export const Spaces = withStaticProperties(SpacesFrame, {
	Item: SpaceItem,
	Items: SpacesItems,
	Group: SpacesGroup,
	Title: SpacesTitle,
});

import { HeaderBackButton } from "@/components/Buttons/HeaderNavButtons";
import { LinearGradient, Text, TouchableArea, View, XStack } from "@/ui";
import React, { type PropsWithChildren } from "react";

type ScreenHeaderProps = {
	title?: string;
	rightElement?: {
		Icon: JSX.Element;
		onPress?: () => void;
	};
};

export function Screen({
	title,
	rightElement,
	children,
}: PropsWithChildren<ScreenHeaderProps>): JSX.Element {
	return (
		<View flex={1} items="center" bg="$surface1">
			<LinearGradient
				width="100%"
				height="100%"
				colors={["$surface1", "$surface3"]}
				position="absolute"
			/>
			<XStack
				width="100%"
				items="center"
				py="$sm"
				px="$sm"
				justify="space-between"
			>
				<XStack gap="$sm" items="center">
					<HeaderBackButton />
					<Text variant="subHeading1" fontWeight="$md" color="$neutral1">
						{title}
					</Text>
				</XStack>
				<TouchableArea rounded="$full" px="$sm" onPress={rightElement?.onPress}>
					{rightElement?.Icon}
				</TouchableArea>
			</XStack>
			{children}
		</View>
	);
}

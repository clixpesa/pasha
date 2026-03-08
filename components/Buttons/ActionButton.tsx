import { Text, TouchableArea, YStack } from "@/ui";
import React from "react";

export function ActionButton({
	onPress,
	Icon,
	contentColor,
	label,
	iconSize,
}): React.JSX.Element {
	return (
		<TouchableArea flex={1} scaleTo={0.96} onPress={onPress} height={80}>
			<YStack
				bg="$tealThemed"
				rounded="$vl"
				p="$sm"
				gap="$sm"
				justify="space-between"
			>
				<Icon color={contentColor} size={iconSize} strokeWidth={2}/>
				<Text color={contentColor} variant="buttonLabel3" >
					{label}
				</Text>
			</YStack>
		</TouchableArea>
	);
}

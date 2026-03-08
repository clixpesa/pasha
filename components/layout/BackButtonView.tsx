import { type ColorTokens, Text, YStack } from "@/ui";
import { RotatableChevron } from "@/ui/components/icons";
import React from "react";

type Props = {
	size?: number;
	color?: ColorTokens;
	showButtonLabel?: boolean;
};

export function BackButtonView({
	size,
	color,
	showButtonLabel,
}: Props): React.JSX.Element {
	return (
		<YStack items="center" gap="$xs">
			<RotatableChevron
				color={color ?? "$neutral2"}
				height={size}
				width={size}
			/>
			{showButtonLabel && (
				<Text color="$neutral2" variant="subHeading1">
					Back
				</Text>
			)}
		</YStack>
	);
}

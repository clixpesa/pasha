import { type ColorTokens, TouchableArea, type TouchableAreaProps } from "@/ui";
import { router } from "expo-router";
import React from "react";
import { BackButtonView } from "../layout/BackButtonView";

type Props = {
	size?: number;
	color?: ColorTokens;
	showButtonLabel?: boolean;
	onPressBack?: () => void;
} & TouchableAreaProps;

export function BackButton({
	onPressBack,
	size,
	color,
	showButtonLabel,
	...rest
}: Props): React.JSX.Element {
	const goBack = onPressBack
		? onPressBack
		: (): void => {
				router.back(); //navigation.goBack()
			};
	return (
		<TouchableArea items="center" hitSlop={24} onPress={goBack} {...rest}>
			<BackButtonView
				color={color}
				showButtonLabel={showButtonLabel}
				size={size}
			/>
		</TouchableArea>
	);
}

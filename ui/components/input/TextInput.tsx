import { useThemeColors } from "@/ui/hooks/useThemeColors";
import React, { forwardRef } from "react";
import { Input, type InputProps } from "tamagui";

export const TextInput = forwardRef<Input, InputProps>(function _TextInput(
	{ onChangeText, onBlur, ...rest },
	ref,
) {
	const colors = useThemeColors();

	return (
		<Input
			ref={ref}
			autoComplete="off"
			bg="$surface1"
			rounded="$md"
			color="$neutral1"
			height="auto"
			placeholderTextColor="$neutral3"
			px="$md"
			py="$sm"
			borderColor="$surface3"
			borderWidth={2}
			selectionColor={colors.neutral3.val}
			focusStyle={{
				borderWidth: 2,
				borderColor: "$neutral3",
				outlineWidth: 0,
			}}
			hoverStyle={{
				borderWidth: 2,
				borderColor: "$surface3",
				outlineWidth: 0,
			}}
			onBlur={onBlur}
			onChangeText={onChangeText}
			{...rest}
		/>
	);
});

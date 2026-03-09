import { ActionButton } from "@/components/Buttons/ActionButton";
import { useThemeColors, XStack } from "@/ui";
import {
	ArrowDownCircle,
	Bank,
	Hamburger,
	SendAction,
} from "@/ui/components/icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";

export function SpaceActions(): JSX.Element {
	const colors = useThemeColors();
	const iconSize = 24;
	const contentColor = colors.accent1.val;
	const [isModalOpen, setIsModalOpen] = useState(false);

	const onPressDeposit = useCallback(() => {
		router.push("/(transactions)/ramps/deposit");
	}, []);
	const onPressSend = useCallback(() => {
		router.push("/(transactions)/transfer/send");
	}, []);
	const onPressReceive = useCallback(() => {
		router.push("/(transactions)/ramps/receive");
	}, []);
	const onPressMore = useCallback(() => {
		console.log("OpenModal")
	}, []);
	const actions = useMemo(
		() => [
			{
				Icon: Bank,
				label: "Deposit",
				onPress: onPressDeposit,
			},
			{
				Icon: SendAction,
				label: "Send",
				onPress: onPressSend,
			},
			{
				Icon: ArrowDownCircle,
				label: "Receive",
				onPress: onPressReceive,
			},
			{
				Icon: Hamburger,
				label: "More",
				onPress: onPressMore,
			},
		],
		[onPressDeposit, onPressSend, onPressReceive, onPressMore],
	);
	return (
		<XStack
			gap="$xs"
			my="$md"
		>
			{actions.map(({ label, Icon, onPress }, idx) => (
				<ActionButton
					key={idx}
					onPress={onPress}
					Icon={Icon}
					contentColor={contentColor}
					label={label}
					iconSize={iconSize}
				/>
			))}
      {/*Add Modal*/}
		</XStack>
	);
}

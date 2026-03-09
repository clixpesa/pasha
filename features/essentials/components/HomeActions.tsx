import { ActionButton } from "@/components/Buttons/ActionButton";
import { useWalletContext } from "@/features/wallet";
import {
	Separator,
	Stack,
	Text,
	TouchableArea,
	XStack,
	YStack,
	useThemeColors,
} from "@/ui";
import {
	ArrowDownCircle,
	Bank,
	Coins,
	FileList,
	MobileAirtime,
	MoreHorizontal,
	Mpesa,
	RotatableChevron,
	SendAction,
} from "@/ui/components/icons";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import React, { useCallback, useMemo, useRef, useState } from "react";

export function HomeActions(): JSX.Element {
	const { mainAccount } = useWalletContext();
	const colors = useThemeColors();
	const iconSize = 24;
	const contentColor = colors.accent1.val;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	const onPressDeposit = useCallback(() => {
		router.push("/(transactions)/ramps/deposit");
	}, []);
	const onPressSend = useCallback(() => {
		router.push("/(transactions)/transfer/recipient");
	}, []);
	const onPressReceive = useCallback(() => {
		router.push("/(transactions)/ramps/receive");
	}, []);
	const onPressMore = useCallback(() => {
		bottomSheetModalRef.current?.present();
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
				Icon: MoreHorizontal,
				label: "More",
				onPress: onPressMore,
			},
		],
		[onPressDeposit, onPressSend, onPressReceive, onPressMore],
	);
	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				style={[props.style]}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.4}
			/>
		),
		[],
	);

	return (
		<XStack gap="$xs" my="$md">
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
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["52%"]}
				backdropComponent={renderBackdrop}
				onDismiss={() => {}}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					<YStack gap="$sm" width="90%" mt="$3xl" mb="$4xl">
						<TouchableArea
							onPress={() => router.navigate("/(essentials)/tokens/overview")}
						>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<Stack
										bg="$accent2"
										height={42}
										rounded="$md"
										width={42}
										items="center"
										justify="center"
									>
										<Coins size={28} color="$accent1" />
									</Stack>
									<YStack width="80%" gap="$3xs">
										<Text>My Assets</Text>
										<Text variant="body4" color="$neutral2">
											View your asset balances
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
						<Separator />
						<TouchableArea
							onPress={() =>
								openBrowserAsync(
									`${mainAccount?.chain?.blockExplorers?.default.url}/address/${mainAccount?.account.address}\#tokentxns`,
								)
							}
						>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<Stack
										bg="$accent2"
										height={42}
										rounded="$md"
										width={42}
										items="center"
										justify="center"
									>
										<FileList size={28} color="$accent1" />
									</Stack>
									<YStack width="80%" gap="$3xs">
										<XStack justify="space-between" items="center">
											<Text>Account Statement</Text>
											{/*<Text color="$accent1"> coming soon</Text>*/}
										</XStack>
										<Text variant="body4" color="$neutral2">
											View all your transactions onchain
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
						<Separator />
						<TouchableArea onPress={() => {}}>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<Stack
										bg="$accent2"
										height={42}
										rounded="$md"
										width={42}
										items="center"
										justify="center"
									>
										<Mpesa size={28} color="$accent1" />
									</Stack>
									<YStack width="80%" gap="$3xs">
										<XStack justify="space-between" items="center">
											<Text>Lipa na MPESA</Text>
											<Text color="$accent1">coming soon</Text>
										</XStack>
										<Text variant="body4" color="$neutral2">
											Pay directly to MPESA
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
						<Separator />
						<TouchableArea onPress={() => {}}>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<Stack
										bg="$accent2"
										height={42}
										rounded="$md"
										width={42}
										items="center"
										justify="center"
									>
										<MobileAirtime size={28} color="$accent1" />
									</Stack>
									<YStack width="80%" gap="$3xs">
										<XStack justify="space-between" items="center">
											<Text>Data and Airtime</Text>
											<Text color="$accent1">coming soon</Text>
										</XStack>
										<Text variant="body4" color="$neutral2">
											Buy airtime for supported networks
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
					</YStack>
				</BottomSheetView>
			</BottomSheetModal>
		</XStack>
	);
}

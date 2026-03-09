import { AccountIcon } from "@/components/account/AccountIcon";
import { useAppState } from "@/features/essentials/appState";
import { Separator, Text, TouchableArea, XStack, YStack } from "@/ui";
import {
	Bell,
	Participants,
	Plus,
	RoscaFill,
	RotatableChevron,
} from "@/ui/components/icons";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useRef } from "react";

export const SpacesHeader = (index: number) => {
	const user = useAppState((s) => s.user);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
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
		<XStack
			width="100%"
			items="center"
			py="$xs"
			px="$sm"
			justify="space-between"
		>
			<XStack gap="$sm" items="center">
				<TouchableArea onPress={() => router.navigate("/(tabs)/account")}>
					<AccountIcon
						address={
							user.mainAddress
								? user.mainAddress
								: "0x765DE816845861e75A25fCA122bb6898B8B1282a"
						}
						size={40}
					/>
				</TouchableArea>
				<Text
					variant="subHeading1"
					fontWeight="$md"
					fontSize="$lg"
					color="$neutral1"
				>
					Spaces
				</Text>
			</XStack>
			<XStack gap="$sm" px="$sm" items="center">
				<TouchableArea
					rounded="$full"
					onPress={() => {
						index.index === 0
							? router.navigate("/(spaces)/savings/create")
							: bottomSheetModalRef.current?.present();
					}}
					borderWidth={2}
					borderColor="$surface3"
					py="$2xs"
					pr="$sm"
					pl="$xs"
				>
					<XStack items="center" gap="$xs">
						<Plus color="$neutral3" size={20} />
						<Text color="$neutral2">New space</Text>
					</XStack>
				</TouchableArea>
				<TouchableArea
					rounded="$full"
					onPress={() => router.navigate("/(spaces)/notifications")}
				>
					<Bell color="$neutral3" size={30} />
				</TouchableArea>
			</XStack>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["50%"]}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					<YStack gap="$sm" width="90%" my="$3xl">
						<TouchableArea
							onPress={() => router.navigate("/(spaces)/roscas/create")}
						>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<RoscaFill size={32} color="$neutral2" />

									<YStack>
										<Text>Create a group</Text>
										<Text variant="body3" color="$neutral2">
											Create a new savings circle.
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
						<Separator />
						<TouchableArea
							onPress={() => router.navigate("/(spaces)/roscas/join")}
						>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<Participants size={32} color="$neutral2" />
									<YStack>
										<Text>Join a group</Text>
										<Text variant="body3" color="$neutral2">
											Search an join a group.
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
};

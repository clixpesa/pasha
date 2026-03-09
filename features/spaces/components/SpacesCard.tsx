import {
	ScrollView,
	Separator,
	Stack,
	Text,
	TouchableArea,
	Unicon,
	UniversalImage,
	UniversalImageResizeMode,
	XStack,
	YStack,
} from "@/ui";
import {
	Participants,
	RoscaFill,
	RotatableChevron,
} from "@/ui/components/icons";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { type RelativePathString, router } from "expo-router";
import { useCallback, useRef } from "react";

export const SpacesCard = () => {
	const iconSize = 64;
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
		<YStack width="100%" mt="$sm" gap="$sm">
			<Text color="$neutral2" mx="$sm">
				Popular spaces
			</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<XStack gap="$sm" mx="$sm">
					{PopularSavings.map((item) => (
						<YStack
							key={item.id}
							bg="$surface1"
							maxW={170}
							width="auto"
							p="$sm"
							gap="$vs"
							rounded="$md"
							onPress={() => {
								if (item.type !== "rosca") {
									if (item.type === "fundraiser") {
										console.log("Fundraiser coming soon!");
										return;
									}
									router.navigate(
										item.type === "challenge"
											? {
													pathname: item.target as RelativePathString,
													params: {
														type: item.type,
														name: item.name,
														amount: 1000,
													},
												}
											: {
													pathname: item.target as RelativePathString,
													params: {
														type: item.type,
													},
												},
									);
								} else {
									bottomSheetModalRef.current?.present();
								}
							}}
						>
							<XStack justify="space-between" items="center">
								<UniversalImage
									style={{ image: { borderRadius: iconSize } }}
									fallback={
										<Unicon
											address="0x765DE816845861e75B25fCA122bb6898B8B1282a"
											size={iconSize}
										/>
									}
									size={{
										width: iconSize,
										height: iconSize,
										resizeMode: UniversalImageResizeMode.Cover,
									}}
									uri={item.icon}
								/>
								{item.type === "fundraiser" ? (
									<Stack items="center">
										<Text variant="body4" color="$accent1">
											Coming
										</Text>
										<Text variant="body4" color="$accent1">
											soon!
										</Text>
									</Stack>
								) : null}
							</XStack>

							<Text variant="subHeading2" color="$neutral1">
								{item.name}
							</Text>
							<Text variant="body3" color="$neutral2" width="100%">
								{item.desc}
							</Text>
						</YStack>
					))}
				</XStack>
			</ScrollView>
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
		</YStack>
	);
};

const PopularSavings = [
	{
		id: "0x0001",
		name: "Easy Saver",
		icon: require("@/ui/assets/images/popular-icons/easy-saver.png"),
		savers: 300,
		desc: "Flexible terms and timelines!",
		target: "/(spaces)/savings/create",
		type: "flex",
	},
	{
		id: "0x0002",
		name: "Fixed Saver",
		icon: require("@/ui/assets/images/popular-icons/fixed-saver.png"),
		savers: 637,
		desc: "Fixed time, more earnings!",
		target: "/(spaces)/savings/create",
		type: "fixed",
	},
	{
		id: "0x0003",
		name: "Chama Circles",
		icon: require("@/ui/assets/images/popular-icons/money-circle.png"),
		savers: 100,
		desc: "Hit bigger goals with savings circles",
		type: "rosca",
	},
	{
		id: "0x0004",
		name: "Weekly Challenge",
		icon: require("@/ui/assets/images/popular-icons/weekly-challenge.png"),
		savers: 2300,
		target: "/(spaces)/savings/customize",
		desc: "Save something every week.",
		type: "challenge",
	},
	{
		id: "0x0005",
		name: "Fundraiser",
		icon: require("@/ui/assets/images/popular-icons/give-money.png"),
		savers: 100,
		target: "/(spaces)/savings/create",
		desc: "Get help from your family and friends",
		type: "fundraiser",
	},
];

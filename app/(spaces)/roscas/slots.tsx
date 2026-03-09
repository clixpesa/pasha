import { AccountIcon } from "@/components/account/AccountIcon";
import { Screen } from "@/components/layout/Screen";
import {
	type RoscaSlot,
	changeRoscaSlot,
	getRoscaSlots,
	isUserSlotted,
	selectRoscaSlot,
} from "@/features/contracts/roscas";
import {
	getRate,
	getTokensByChainId,
	useWalletContext,
} from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	ScrollView,
	Separator,
	Spacer,
	Stack,
	Text,
	TouchableArea,
	View,
	XStack,
	YStack,
} from "@/ui";
import { PlusCircle, RoscaFill } from "@/ui/components/icons";
import { isSameAddress } from "@/utilities/addresses";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Address } from "viem";

export default function SlotsScreen() {
	const params = useLocalSearchParams();
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const currency = useWalletState((s) => s.currency);
	const { symbol, conversionRate } = getRate(currency);
	const { defaultChainId } = useEnabledChains();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
	const [slotId, setSlotId] = useState<number>(0);
	const [userSlotted, setIsSlotted] = useState<{
		isSlotted: boolean;
		freeSlots: number;
	}>({
		isSlotted: true,
		freeSlots: 0,
	});
	const { updateCurrentChainId, mainAccount } = useWalletContext();

	const [slots, setSlots] = useState<RoscaSlot[]>([]);
	//console.log(slots);
	const tokens = getTokensByChainId(defaultChainId);
	const spaceToken = tokens.find((token) =>
		isSameAddress(token.address, params.token as Address),
	);
	const rate = spaceToken?.symbol.includes("USD") ? conversionRate : 1;
	const duration = Number(params.interval) * (Number(params.memberCount) - 1);
	const endDate = new Date((Number(params.startDate) + duration) * 1000);
	const startDate = new Date(Number(params.startDate) * 1000);
	const years = endDate.getFullYear() - startDate.getFullYear();
	const months = endDate.getMonth() - startDate.getMonth();
	const days = endDate.getDate() - startDate.getDate();
	const fractionalMonth = days / 30;
	const monthsDuration = years * 12 + months + fractionalMonth;

	const selectedSlot = slots.find((slot) => slot.slotId === slotId);
	const isSameSlot = isSameAddress(
		selectedSlot?.owner as Address,
		mainAccount?.account?.address,
	);

	const onOpenModal = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
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

	const fetchSlotsInfo = useCallback(async () => {
		const slots = await getRoscaSlots({
			chainId: defaultChainId,
			spaceId: params.spaceId as Address,
		});
		const userSlotted = await isUserSlotted({
			chainId: defaultChainId,
			spaceId: params.spaceId as string,
			userAddress: mainAccount?.account?.address as Address,
		});
		setSlots(slots);
		setIsSlotted(userSlotted);
	}, [defaultChainId, mainAccount?.account?.address]);

	const handleSlotSelection = async () => {
		setIsTxLoading(true);
		if (mainAccount && slotId) {
			if (userSlotted.isSlotted) {
				const txHash = await changeRoscaSlot({
					account: mainAccount,
					chainId: defaultChainId,
					spaceId: params.spaceId as string,
					slotId: slotId,
				});
				if (txHash) await fetchSlotsInfo();
			} else {
				const txHash = await selectRoscaSlot({
					account: mainAccount,
					chainId: defaultChainId,
					spaceId: params.spaceId as string,
					slotId: slotId,
				});
				if (txHash) await fetchSlotsInfo();
			}
		}
		setIsTxLoading(false);
		bottomSheetModalRef.current?.close();
	};

	useEffect(() => {
		const getSlots = async () => {
			await fetchSlotsInfo();
		};
		getSlots();
	}, [fetchSlotsInfo]);
	return (
		<Screen title="Slots">
			<YStack self="baseline" mx="$lg" mt="$lg" width="90%" gap="$sm">
				<XStack items="center" gap="$sm">
					<Stack
						bg="$accent2"
						height={46}
						rounded="$md"
						width={46}
						items="center"
						justify="center"
					>
						<RoscaFill size={28} color="$accent1" />
					</Stack>
					<YStack gap="$2xs">
						<Text variant="body3" color="$neutral2">
							Circle Value
						</Text>
						<Text variant="subHeading1">
							{symbol} {(Number(params.payoutAmount) * rate).toFixed(2)}
						</Text>
					</YStack>
				</XStack>
				<XStack justify="space-between">
					<YStack gap="$2xs">
						<Text variant="body3" color="$neutral2">
							Pay
						</Text>
						<Text variant="subHeading2">
							{symbol}{" "}
							{(
								(Number(params.payoutAmount) / Number(params.memberCount)) *
								rate
							).toFixed(0)}
						</Text>
					</YStack>
					<YStack gap="$2xs">
						<Text variant="body3" color="$neutral2">
							Duration
						</Text>
						<Text variant="subHeading2">
							{monthsDuration.toFixed(0)} Months
						</Text>
					</YStack>
					<YStack gap="$2xs">
						<Text variant="body3" color="$neutral2">
							Start
						</Text>
						<Text variant="subHeading2">
							{startDate.toLocaleDateString("en-US", {
								day: "numeric",
								month: "short",
							})}
						</Text>
					</YStack>
					<YStack gap="$2xs">
						<Text variant="body3" color="$neutral2">
							End
						</Text>
						<Text variant="subHeading2">
							{endDate.toLocaleDateString("en-US", {
								day: "numeric",
								month: "short",
							})}
						</Text>
					</YStack>
				</XStack>
			</YStack>
			<Separator width="90%" mt="$sm" />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View
					flexDirection="row"
					flexWrap="wrap"
					gap="$vs"
					mt="$md"
					mb="$3xl"
					justify="center"
					self="center"
					width="100%"
				>
					{slots
						.filter((slot) => slot.owner)
						.map((slot) => (
							<TouchableArea
								key={slot.slotId}
								onPress={() => {
									setSlotId(slot.slotId);
									onOpenModal();
								}}
							>
								<YStack
									items="center"
									justify="center"
									gap="$2xs"
									width={80}
									height={72}
								>
									<AccountIcon
										address={slot.owner as Address}
										size={32}
										showBorder={true}
										borderWidth={1}
										borderColor="$tealVibrant"
									/>
									<Text variant="body3">{slot.payoutDate}</Text>
								</YStack>
							</TouchableArea>
						))}
					{slots
						.filter((slot) => !slot.owner)
						.map((slot) => (
							<TouchableArea
								bg="$surface1"
								key={slot.slotId}
								onPress={() => {
									setSlotId(slot.slotId);
									onOpenModal();
								}}
							>
								<YStack
									items="center"
									justify="center"
									gap="$2xs"
									width={80}
									height={72}
								>
									<PlusCircle size={24} color="$accent1" />
									<Text variant="body3">{slot.payoutDate}</Text>
								</YStack>
							</TouchableArea>
						))}
				</View>
			</ScrollView>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["50%"]}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					<YStack items="center" gap="$sm" width="100%" my="$3xl">
						<Stack
							bg="$accent2"
							height={60}
							rounded="$md"
							width={60}
							items="center"
							justify="center"
						>
							<RoscaFill size={28} color="$accent1" />
						</Stack>
						<YStack gap="$2xs" items="center">
							<Text>
								{isSameSlot ? "You are leaving" : "Are you sure you want"}
							</Text>
							<Text variant="subHeading1">
								Slot no.{slotId} - {selectedSlot?.payoutDate}
							</Text>
						</YStack>
						<YStack gap="$xs" items="center">
							<Text>Payout</Text>
							<Text variant="subHeading1" color="$accent1" fontSize={24}>
								{symbol} {(selectedSlot?.payoutAmount * rate).toFixed(2)}
							</Text>
						</YStack>
						<Spacer flex={1} />
						<Button
							size="lg"
							variant={isSameSlot ? "warning" : "branded"}
							width="85%"
							isDisabled={isSameSlot}
							loading={isTxLoading}
							onPress={() => handleSlotSelection()}
						>
							{isTxLoading
								? "Reserving Slot..."
								: userSlotted.isSlotted
									? "Confirm Change"
									: "Confirm Selection"}
						</Button>
						<Button
							size="lg"
							variant="branded"
							emphasis="secondary"
							width="85%"
							onPress={() => bottomSheetModalRef.current?.close()}
						>
							Cancel
						</Button>
					</YStack>
				</BottomSheetView>
			</BottomSheetModal>
		</Screen>
	);
}

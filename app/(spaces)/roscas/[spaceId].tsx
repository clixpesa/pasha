import { BackButton } from "@/components/Buttons/BackButton";
import { AccountIcon } from "@/components/account/AccountIcon";
import {
	type RoscaSlot,
	frequencyOptions,
	getActiveRoscaSlots,
	getRosca,
	isUserSlotted,
} from "@/features/contracts/roscas";
import { useAppState } from "@/features/essentials/appState";
import { TransactionsCard } from "@/features/spaces/components/TransactionsCard";
import { getChainInfo, getRate, getTokensByChainId } from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	IconButton,
	LinearGradient,
	Separator,
	Stack,
	Text,
	TouchableArea,
	View,
	XStack,
	YStack,
} from "@/ui";
import {
	Bell,
	Hamburger,
	Participants,
	ReceiveAlt,
	RoscaFill,
	RotatableChevron,
	SendAction,
} from "@/ui/components/icons";
import { isSameAddress, shortenAddress } from "@/utilities/addresses";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Progress } from "tamagui";
import type { Address } from "viem";

export default function SpaceHome() {
	const params = useLocalSearchParams();
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const user = useAppState((s) => s.user);
	const currency = useWalletState((s) => s.currency);
	const { defaultChainId } = useEnabledChains();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { symbol, conversionRate } = getRate(currency);
	const chain = getChainInfo(defaultChainId);
	const [hasRequests, setHasRequest] = useState<number>(0);

	const [userSlotted, setIsSlotted] = useState<{
		isSlotted: boolean;
		freeSlots: number;
	}>({
		isSlotted: true,
		freeSlots: 0,
	});

	const [spaceInfo, setSpaceInfo] = useState({
		spaceId: params.spaceId as string,
		name: params.name as string,
		admin: "0x",
		startDate: Number(params.startDate),
		memberCount: Number(params.memberCount),
		interval: Number(params.interval),
		token: "0x",
		totalBalance: 0,
		yield: 0,
		loan: 0,
		payoutAmount: Number(params.payoutAmount),
	});

	const [slotsInfo, setSlotsInfo] = useState<RoscaSlot[]>([
		{
			slotId: 0,
			amount: 0,
			payoutAmount: 0,
			payoutDate: "",
			owner: null,
			paidOut: false,
		},
	]);

	const tokens = getTokensByChainId(defaultChainId);
	const spaceToken = tokens.find((token) =>
		isSameAddress(token.address, spaceInfo.token),
	);
	const isMySlot = slotsInfo[0].owner
		? isSameAddress(slotsInfo[0].owner, user.mainAddress)
		: false;
	const isTarget = slotsInfo[0].amount === slotsInfo[0].payoutAmount;
	const rate = spaceToken?.symbol.includes("USD") ? conversionRate : 1;
	const balInCurreny = spaceInfo.totalBalance * rate;
	const balSplit = balInCurreny.toFixed(2).split(".");

	const progress = Number(
		((slotsInfo[0].amount / slotsInfo[0].payoutAmount) * 100).toFixed(0),
	);
	const transactions: any[] = [];

	useEffect(() => {
		setIsLoading(true);
		const getSpace = async () => {
			const rosca = await getRosca({
				chainId: defaultChainId,
				spaceId: spaceInfo.spaceId,
			});
			const userSlotted = await isUserSlotted({
				chainId: defaultChainId,
				spaceId: spaceInfo.spaceId,
				userAddress: user.mainAddress as Address,
			});
			const activeSlots = await getActiveRoscaSlots({
				chainId: defaultChainId,
				spaceId: spaceInfo.spaceId,
			});
			const roscaDoc = await getDoc(
				doc(getFirestore(), "SPACES", spaceInfo.spaceId),
			);
			if (roscaDoc.exists()) {
				const spaceData = roscaDoc.data();
				const requests = spaceData?.requests || [];
				setHasRequest(requests.length);
				const txs = spaceData?.txs || [];
				//set transactions
			}
			if (rosca) setSpaceInfo(rosca);
			setSlotsInfo(activeSlots);
			setIsSlotted(userSlotted);
			setIsLoading(false);
		};
		setIsLoading(false);
		getSpace();
	}, [defaultChainId, spaceInfo.spaceId, user]);

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
	return (
		<View flex={1} bg="$surface1" items="center">
			<LinearGradient
				width="100%"
				height="100%"
				colors={["$surface1", "$surface3"]}
				position="absolute"
			/>
			<YStack gap="$md" width="100%" items="center">
				<XStack
					height={265}
					bg="$blueLight"
					width="100%"
					justify="space-between"
					items="flex-end"
					px="$xl"
					py="$xl"
				>
					<XStack
						position="absolute"
						t="$lg"
						l="$lg"
						justify="space-between"
						width="100%"
					>
						<BackButton
							color="$neutral2"
							size={28}
							onPressBack={() => router.replace("/(tabs)/spaces")}
						/>
						<TouchableArea
							rounded="$full"
							onPress={() =>
								router.navigate({
									pathname: "/(spaces)/roscas/notifications",
									params: {
										spaceId: spaceInfo.spaceId,
									},
								})
							}
						>
							<Stack position="relative">
								{hasRequests > 0 && (
									<Stack
										position="absolute"
										t={-4}
										r={-4}
										bg="$accent1"
										width={18}
										height={18}
										rounded="$full"
										justify="center"
										items="center"
										z={1}
									>
										<Text
											color="white"
											fontSize={10}
											fontWeight="bold"
											lineHeight={14}
										>
											{hasRequests}
										</Text>
									</Stack>
								)}
								<Bell color="$neutral2" size={28} />
							</Stack>
						</TouchableArea>
					</XStack>
					<YStack gap="$xl">
						<Text variant="subHeading1" fontSize={24}>
							{spaceInfo.name}
						</Text>
						<YStack gap="$xs">
							<Text
								variant="heading3"
								fontWeight="800"
								color="$neutral1"
								fontSize={30}
							>
								{`${symbol} ${balSplit[0]}`}
								<Text
									variant="heading3"
									fontWeight="800"
									color="$neutral3"
									fontSize={30}
								>
									.{balSplit[1]}
								</Text>
							</Text>
							<XStack items="center" gap="$2xs">
								<Text variant="subHeading2" color="$neutral2">
									≈ $
									{((spaceInfo.totalBalance - spaceInfo.yield) / rate).toFixed(
										2,
									)}
								</Text>
								<TouchableArea
									bg="$tealThemed"
									rounded="$full"
									py="$4xs"
									px="$sm"
									onPress={() => {}}
								>
									<Text variant="subHeading2" color="$neutral1">
										+{(spaceInfo.yield / rate).toFixed(2)}
									</Text>
								</TouchableArea>
							</XStack>
						</YStack>
					</YStack>
					<IconButton
						icon={<Hamburger size={24} color="$accent1" />}
						size="md"
						variant="branded"
						emphasis="secondary"
						onPress={() => onOpenModal()}
					/>
				</XStack>
				{!userSlotted.isSlotted ? (
					<YStack gap="$xs" width="92%">
						<Text ml="$lg">
							Pick your slot before {slotsInfo[0].payoutDate}
						</Text>
						<YStack gap="$xs" p="$sm" rounded="$md" bg="$surface1">
							<XStack justify="space-between">
								<YStack gap="$2xs">
									<Text color="$neutral2" variant="body3">
										Target payout
									</Text>
									<Text variant="subHeading1" color="$tealDark">
										{symbol} {(spaceInfo.payoutAmount * rate).toFixed(2)}
									</Text>
								</YStack>
								<Button
									variant="branded"
									width="30%"
									rounded="$full"
									size="sm"
									icon={<RotatableChevron direction="right" />}
									iconPosition="after"
									onPress={() =>
										router.navigate({
											pathname: "/(spaces)/roscas/slots",
											params: {
												...spaceInfo,
											},
										})
									}
								>
									Pick slot
								</Button>
							</XStack>
							<XStack items="center">
								<Text mr="$sm" variant="body3">
									Pay
								</Text>
								<Separator />
							</XStack>
							<XStack justify="space-between">
								<Text>
									{symbol}{" "}
									{(
										(spaceInfo.payoutAmount / spaceInfo.memberCount) *
										rate
									).toFixed(2)}{" "}
									<Text color="$neutral2">
										{
											frequencyOptions.find(
												(frq) => frq.interval === spaceInfo.interval,
											)?.name
										}
									</Text>
								</Text>
								<Text>{userSlotted.freeSlots} Free slots</Text>
							</XStack>
						</YStack>
					</YStack>
				) : null}
				{slotsInfo.map((slot, index) => {
					return slot.slotId > 0 ? (
						<YStack
							gap="$sm"
							width="92%"
							px="$sm"
							py="$md"
							rounded="$lg"
							bg="$surface1"
							key={slot.slotId}
						>
							<XStack justify="space-between">
								<YStack>
									<Text
										fontWeight="$md"
										color={index === 1 ? "$orangeVibrant" : "$neutral1"}
									>
										Slot No.{slot.slotId}
										{index === 1 ? " (In default!)" : null}
									</Text>
									<Text variant="body3">
										{slot.owner
											? shortenAddress(slot.owner as Address, 6)
											: "Unclaimed"}
									</Text>
								</YStack>
								{slot.owner ? (
									<AccountIcon address={slot.owner} size={42} />
								) : (
									<Button
										variant="branded"
										width="30%"
										rounded="$full"
										size="sm"
										icon={<RotatableChevron direction="right" />}
										iconPosition="after"
										onPress={() =>
											router.navigate({
												pathname: "/(spaces)/roscas/slots",
												params: {
													...spaceInfo,
												},
											})
										}
									>
										Claim
									</Button>
								)}
							</XStack>
							<XStack items="center" mt="$2xs">
								<Text mr="$sm" variant="body3">
									Paid
								</Text>
								<Progress
									value={progress}
									height="$xs"
									bg="$tealThemed"
									width="87%"
								>
									<Progress.Indicator
										bg="$tealBase"
										animation="80ms-ease-in-out"
									/>
								</Progress>
							</XStack>
							<XStack justify="space-between" items="center">
								<Text fontWeight="$md">
									{symbol}
									{(slot.amount * rate).toFixed(2)}
								</Text>
								<Text variant="body3">
									<Text color="$neutral2" variant="body3">
										Due:
									</Text>{" "}
									{slot.payoutDate}
								</Text>
							</XStack>
						</YStack>
					) : null;
				})}

				<TransactionsCard transactions={transactions} isLoading={isLoading} />
			</YStack>
			<XStack justify="space-between" position="absolute" b="$3xl" width="92%">
				<Button
					variant="branded"
					emphasis={
						slotsInfo[0].amount > 0 && isMySlot ? "secondary" : "primary"
					}
					size="lg"
					width={
						slotsInfo[0].amount > 0 && isMySlot
							? isTarget
								? "25%"
								: "48%"
							: "72%"
					}
					icon={<SendAction size={24} />}
					onPress={async () => {
						router.navigate({
							pathname: "/(spaces)/add-cash",
							params: {
								address: chain.contracts?.roscas.address,
								name: spaceInfo.name,
								id: spaceInfo.spaceId,
								origin: "rosca",
								token: spaceToken?.symbol,
							},
						});
					}}
				>
					{isTarget && isMySlot ? null : "Fund Slot"}
				</Button>
				<Button
					variant="branded"
					emphasis={isTarget && isMySlot ? "primary" : "secondary"}
					size="lg"
					isDisabled={!isMySlot}
					width={
						slotsInfo[0].amount > 0 && isMySlot
							? isTarget
								? "72%"
								: "48%"
							: "25%"
					}
					icon={<ReceiveAlt size={24} />}
					onPress={() =>
						router.navigate({
							pathname: "/(spaces)/cash-out",
							params: {
								address: chain.contracts?.roscas.address,
								name: spaceInfo.name,
								id: spaceInfo.spaceId,
								orign: "rosca",
								token: spaceToken?.symbol,
							},
						})
					}
				>
					{slotsInfo[0].amount > 0 && isMySlot ? "Cash Out" : null}
				</Button>
			</XStack>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["50%"]}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					<YStack gap="$sm" width="90%" my="$3xl">
						<TouchableArea
							onPress={() => {
								router.navigate({
									pathname: "/(spaces)/roscas/info",
									params: {
										...spaceInfo,
									},
								});
							}}
						>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<Participants size={32} color="$neutral2" />
									<YStack>
										<Text>Group Info</Text>
										<Text variant="body3" color="$neutral2">
											Check out other group members
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
						<Separator />
						<TouchableArea
							onPress={() => {
								router.navigate({
									pathname: "/(spaces)/roscas/slots",
									params: {
										...spaceInfo,
									},
								});
							}}
						>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<RoscaFill size={32} color="$neutral2" />
									<YStack>
										<Text>Manage Slots</Text>
										<Text variant="body3" color="$neutral2">
											Select or change your slot
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
					</YStack>
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
}

import { Screen } from "@/components/layout/Screen";
import { frequencyOptions } from "@/features/contracts/roscas";
import { useAppState } from "@/features/essentials/appState";
import { getTokensByChainId, useWalletContext } from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import {
	Button,
	Separator,
	Spacer,
	Stack,
	Text,
	Unicon,
	UniversalImage,
	UniversalImageResizeMode,
	XStack,
	YStack,
} from "@/ui";
import {
	CalendarEvent,
	CheckmarkCircle,
	CoinStack,
	Medal,
	Participants,
	RoscaFill,
	SwapCoin,
} from "@/ui/components/icons";
import { isSameAddress } from "@/utilities/addresses";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
	arrayUnion,
	doc,
	getDoc,
	getFirestore,
	setDoc,
	updateDoc,
} from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";

export default function GroupOverview() {
	const params = useLocalSearchParams();
	const user = useAppState((s) => s.user);
	const { defaultChainId } = useEnabledChains();
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const tokens = getTokensByChainId(defaultChainId);
	const spaceToken = tokens.find((token) =>
		isSameAddress(token.address, params.token as string),
	);
	const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
	const [txReciept, setTxReciept] = useState<{
		txHash: string;
		spaceId: string | undefined;
	}>();

	const { mainAccount } = useWalletContext();

	const isUSD = spaceToken?.symbol.includes("USD");
	const endTime =
		Number(params.startDate) +
		Number(params.interval) * (Number(params.memberCount) - 1);
	const date: Date = new Date(endTime * 1000);
	const freq = frequencyOptions.find(
		(freq) => freq.interval === Number(params.interval),
	);
	const iconSize = 42;

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

	const onPressJoin = async () => {
		setIsTxLoading(true);
		if (mainAccount) {
			/*const reciept = await joinRosca({
				account: mainAccount,
				chainId: defaultChainId,
				spaceId: params.spaceId as string,
			});
			//console.log(reciept);
			setTxReciept({
				txHash: reciept.txHash,
				spaceId: reciept._spaceId,
			});*/
			try {
				const userRef = doc(getFirestore(), "USERS", user.uid);
				const spaceRef = doc(
					getFirestore(),
					"SPACES",
					params.spaceId as string,
				);
				const space = await getDoc(spaceRef);
				if (space.exists()) {
					await updateDoc(spaceRef, {
						requests: arrayUnion(userRef),
					});
				} else {
					await setDoc(spaceRef, {
						requests: arrayUnion(userRef),
					});
				}
				setIsTxLoading(false);
				onOpenModal();
			} catch (e) {
				console.log(e);
			}
		}
	};
	return (
		<Screen>
			<YStack items="center" gap="$md" width="92%">
				<Stack
					bg="$accent2"
					height={60}
					rounded="$md"
					width={60}
					items="center"
					justify="center"
				>
					{params.type === "rosca" ? (
						<RoscaFill size={32} color="$accent1" />
					) : (
						<Medal size={32} color="$accent1" />
					)}
				</Stack>
				<YStack gap="$2xs" items="center">
					<Text variant="subHeading1" fontSize={24}>
						{params.name}
					</Text>
					<Text color="$neutral2">
						{params.type === "rosca"
							? `${freq?.frequency} Chama`
							: "Group Challenge"}
					</Text>
				</YStack>
				<Separator width="92%" mt="$3xl" />
				<XStack justify="space-between" width="92%">
					<XStack items="center" gap="$sm">
						<Participants size={32} color="$neutral2" />
						<Text>{params.type === "rosca" ? "Members" : "Challengers"}</Text>
					</XStack>
					<XStack gap="$2xs">
						<UniversalImage
							style={{ image: { borderRadius: iconSize } }}
							fallback={
								<Unicon address={params.admin as Address} size={iconSize} />
							}
							size={{
								width: iconSize,
								height: iconSize,
								resizeMode: UniversalImageResizeMode.Cover,
							}}
							uri={params.ownerIcon ? Number(params.ownerIcon) : ""}
						/>
						<YStack>
							<Text>+{Number(params.memberCount) - 1}</Text>
							<Text variant="body3">others</Text>
						</YStack>
					</XStack>
				</XStack>
				<Separator width="92%" />
				<XStack justify="space-between" width="92%" items="center">
					<XStack items="center" gap="$md">
						<CoinStack size={28} color="$neutral2" />
						<Text>{params.type === "rosca" ? "Payout" : "Target"}</Text>
					</XStack>
					<Text>{`${params.payoutAmount} ${isUSD ? "USD" : "KES"}`}</Text>
				</XStack>
				<Separator width="92%" />
				<XStack justify="space-between" width="92%" items="center">
					<XStack items="center" gap="$sm">
						<SwapCoin size={32} color="$neutral2" />
						<Text>Frequency</Text>
					</XStack>
					<YStack gap="$2xs" items="flex-end">
						<Text>
							{params.type === "rosca"
								? `${(Number(params.payoutAmount) / Number(params.memberCount)).toFixed(2)} ${isUSD ? "USD" : "KES"}`
								: `${(Number(params.amount) / Number(365)).toFixed(2)} ${params.currency}`}
						</Text>
						<Text variant="body3">
							{params.type === "rosca" ? freq?.name : "Daily"}
						</Text>
					</YStack>
				</XStack>
				<Separator width="92%" />
				<XStack justify="space-between" width="92%" items="center">
					<XStack items="center" gap="$sm">
						<CalendarEvent size={32} color="$neutral2" />
						<Text>{params.type === "rosca" ? "End Date" : "Deadline"}</Text>
					</XStack>
					<Text>
						{date.toLocaleDateString("en-US", {
							day: "numeric",
							month: "short",
							year: "numeric",
						})}
					</Text>
				</XStack>
				<Separator width="92%" />
				{params.real === "true" ? null : (
					<Text color="$statusCritical">Unfortunately the group is full!</Text>
				)}
			</YStack>
			<Spacer />

			<Button
				variant="branded"
				size="lg"
				minW="85%"
				position="absolute"
				loading={isTxLoading}
				isDisabled={params.real === "false"}
				b="$4xl"
				onPress={() => onPressJoin()}
			>
				{isTxLoading
					? "Joining..."
					: params.type === "rosca"
						? "Request to Join"
						: "Join Group"}
			</Button>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["50%"]}
				backdropComponent={renderBackdrop}
				enableContentPanningGesture={false}
				handleIndicatorStyle={{ backgroundColor: "#ffffff" }}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					<YStack items="center" gap="$sm" width="100%" my="$3xl">
						<CheckmarkCircle
							color="$statusSuccess"
							size={80}
							strokeWidth={1.5}
						/>
						<Text>Your request to join</Text>
						<Text variant="subHeading1">{params.name}</Text>
						<Text>has been sent successfully</Text>

						<Spacer flex={1} />
						{/*<Button
							size="lg"
							variant="branded"
							emphasis="tertiary"
							width="85%"
							onPress={() =>
								openBrowserAsync(
									`${mainAccount?.chain?.blockExplorers?.default.url}/tx/${txReciept?.txHash}`,
								)
							}
						>
							View ticket
						</Button>*/}
						<Button
							size="lg"
							variant="branded"
							width="85%"
							onPress={
								() => router.back()
								/*router.navigate({
									pathname: "/(spaces)/roscas/[spaceId]",
									params: {
										spaceId: txReciept?.spaceId,
										admin: mainAccount?.account?.address,
										name: params.name,
										payoutAmount: params.payoutAmount,
										startDate: params.startDate,
										memberCount: params.memberCount,
										interval: params.interval,
									},
								})*/
							}
						>
							Done
						</Button>
					</YStack>
				</BottomSheetView>
			</BottomSheetModal>
		</Screen>
	);
}

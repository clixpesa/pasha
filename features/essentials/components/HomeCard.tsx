import { subscribeToOverdraft } from "@/features/contracts/overdraft";
import { getRate, useWalletContext } from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import { useBalances, useWalletState } from "@/features/wallet/walletState";
import { Button, Stack, Text, TouchableArea, XStack, YStack } from "@/ui";
import { Currency, Jazisha, RotatableChevron } from "@/ui/components/icons";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { HomeActions } from "./HomeActions";

export const HomeCard = () => {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const { updateCurrentChainId, mainAccount, isLoading } = useWalletContext();
	const { defaultChainId } = useEnabledChains();
	const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
	const { totalBalanceUSD, overdraft, currency } = useBalances();
	const { symbol, conversionRate } = getRate(currency);
	const balInCurreny = totalBalanceUSD * conversionRate;
	const balSplit = balInCurreny.toFixed(2).split(".");
	const updateOverdraft = useWalletState((s) => s.updateOverdraft);

	const onOpenModal = useCallback(() => {
		bottomSheetModalRef.current?.present();
		//change chain to celo/alfajores
		updateCurrentChainId(defaultChainId);
	}, [defaultChainId, updateCurrentChainId]);
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

	const onHandleJazisha = async () => {
		try {
			setIsTxLoading(true);
			const txHash = await subscribeToOverdraft({
				account: mainAccount,
				initialLimit: {
					inUSD: "10",
					inLocalCurreny: (10 * conversionRate).toFixed(6),
				},
				chainId: defaultChainId,
			});
			updateOverdraft(10);
			setIsTxLoading(false);
		} catch (error) {
			setIsTxLoading(false);
			console.log(error);
		}
	};

	return (
		<YStack width="95%" mt="$sm">
			<XStack justify="space-between" mx="$2xs">
				<YStack gap="$2xs">
					<Text color="$neutral2">Your Balance </Text>
					<Text variant="heading2" fontWeight="800" color="$neutral1">
						{`${symbol} ${balSplit[0]}`}
						<Text variant="heading2" fontWeight="800" color="$neutral3">
							.{balSplit[1]}
						</Text>
					</Text>
					<XStack items="center" gap="$2xs">
						<Text variant="subHeading2" color="$neutral2">
							≈ ${totalBalanceUSD.toFixed(2)}
						</Text>
						<TouchableArea
							bg="$bluePastel"
							rounded="$full"
							py="$4xs"
							px="$sm"
							onPress={onOpenModal}
						>
							<Text variant="subHeading2" color="$neutral1">
								+{overdraft.balanceUSD.toFixed(2)}
							</Text>
						</TouchableArea>
					</XStack>
				</YStack>
				<TouchableArea
					onPress={() => {
						router.push("/(essentials)/tokens/overview");
					}}
				>
					<YStack
						items="center"
						bg="$surface3"
						borderTopRightRadius={16}
						borderEndEndRadius={16}
						borderRightWidth={2}
						borderColor="$surface3"
					>
						<RotatableChevron direction="right" color="$neutral2" mt="$2xs" />
						<Stack width="$4xl" items="center" py="$vs" overflow="hidden">
							<Currency
								size={54}
								rotate="-30deg"
								color="$accent1"
								opacity={0.85}
							/>
						</Stack>
					</YStack>
				</TouchableArea>
			</XStack>
			<HomeActions />
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["52%"]}
				backdropComponent={renderBackdrop}
				onDismiss={() => {}}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					<JazishaContent
						onPressButton={onHandleJazisha}
						isLoading={isTxLoading}
						balance={overdraft.balanceUSD.toFixed(2)}
					/>
				</BottomSheetView>
			</BottomSheetModal>
		</YStack>
	);
};

const JazishaContent = ({
	onPressButton,
	isLoading,
	balance,
}: { onPressButton: () => void; isLoading: boolean; balance: string }) => {
	return (
		<YStack gap="$lg" mt="$md" mb="$3xl" items="center" width="92%">
			<Stack p="$md" bg="$blueLight" rounded="$lg">
				<Jazisha size={32} color="$blueBase" />
			</Stack>
			<YStack width="80%" gap="$2xs">
				<Text variant="subHeading1" text="center" px="$2xl">
					Finalize what you need to with Jazisha!
				</Text>
				<Text text="center" color="$neutral2">
					Transfer or make a payment even on low balance with Clixpesa
					Overdraft.
				</Text>
			</YStack>
			<YStack width="70%" gap="$2xs" items="center">
				<Text>Available:</Text>
				<Text variant="heading3" fontWeight="600">
					{balance}/100 USD
				</Text>
				<Text color="$neutral2">Only on CELO</Text>
			</YStack>
			<Button
				size="lg"
				variant="branded"
				emphasis={Number(balance) > 0 ? "secondary" : null}
				width="85%"
				loading={isLoading}
				onPress={onPressButton}
			>
				{isLoading
					? "Subscribing..."
					: Number(balance) > 0
						? "Unsubscribe"
						: "Get started"}
			</Button>
		</YStack>
	);
};

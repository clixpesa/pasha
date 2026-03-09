import { Screen } from "@/components/layout/Screen";
import { TokenItem } from "@/components/lists/TokenItem";
import { subscribeToOverdraft } from "@/features/contracts/overdraft";
import { getRate, useGetRateQuery, useWalletContext } from "@/features/wallet";
import { useEnabledChains, useEnabledTokens } from "@/features/wallet/hooks";
import { useBalances, useWalletState } from "@/features/wallet/walletState";
import { Button, Stack, Text, TouchableArea, XStack, YStack } from "@/ui";
import {
	ExternalLink,
	Jazisha,
	QrCode,
	RotatableChevron,
} from "@/ui/components/icons";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useCallback, useRef, useState } from "react";
//TODO: Add filters bases on supported chains

export default function AssetsScreen() {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const { updateCurrentChainId, mainAccount, isLoading } = useWalletContext();
	const updateOverdraft = useWalletState((s) => s.updateOverdraft);

	const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
	const { totalBalanceUSD, overdraft, currency } = useBalances();
	const tokens = useEnabledTokens();
	const { defaultChainId } = useEnabledChains();
	const { symbol } = getRate(currency);
	const { data: ratesData } = useGetRateQuery(currency);
	const balInCurreny = totalBalanceUSD * ratesData?.selling_rate;

	const balSplit = balInCurreny.toFixed(2).split(".");
	const defaultShilling = tokens.find(
		(item) =>
			(item.symbol.endsWith("SH") || item.symbol.endsWith("KES")) &&
			item.chainId === defaultChainId,
	);
	const shillingsWithBal = tokens.filter(
		(token) =>
			(token.symbol.endsWith("SH") || token.symbol.endsWith("KES")) &&
			token.balance > 0,
	);
	const defaultDollar = tokens.find(
		(item) => item.symbol.includes("USDT") && item.chainId === defaultChainId,
	);
	const dollarsWithBal = tokens.filter(
		(token) => token.symbol.includes("USD") && token.balance > 0,
	);

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
					inLocalCurreny: (10 * ratesData?.selling_rate).toFixed(6),
				},
				chainId: defaultChainId,
			});
			updateOverdraft(10, ratesData?.selling_rate);
			setIsTxLoading(false);
		} catch (error) {
			setIsTxLoading(false);
			console.log(error);
		}
	};
	return (
		<Screen
			title="Your Assets"
			rightElement={{
				Icon: <QrCode size={24} color="$neutral2" />,
				onPress: () => router.navigate("/(transactions)/ramps/receive"),
			}}
		>
			<YStack gap="$xs" mt="$lg" width="92%" items="center">
				<Text
					variant="heading3"
					fontWeight="800"
					color="$neutral1"
					fontSize={28}
				>
					{`${symbol} ${balSplit[0]}`}
					<Text
						variant="heading3"
						fontWeight="800"
						color="$neutral3"
						fontSize={28}
					>
						.{balSplit[1]}
					</Text>
				</Text>
				<Text variant="subHeading2" color="$neutral2">
					≈ ${totalBalanceUSD.toFixed(2)}
				</Text>
				<Text variant="subHeading2" color="$blueBase">
					Available Jazisha: ${overdraft.balanceUSD.toFixed(2)}
				</Text>
				{overdraft.balanceUSD > 0 ? null : (
					<TouchableArea onPress={onOpenModal}>
						<XStack
							justify="space-between"
							items="center"
							bg="$surface1"
							borderBottomWidth={2}
							borderBottomColor="$surface2"
							rounded="$lg"
							mt="$sm"
							p="$sm"
						>
							<XStack items="center" gap="$sm">
								<Stack
									bg="$blueBase"
									height={42}
									rounded="$md"
									width={42}
									items="center"
									justify="center"
								>
									<Jazisha size={28} color="$surface1" />
								</Stack>
								<YStack width="80%" gap="$3xs">
									<XStack justify="space-between">
										<Text>Jazisha!</Text>
										<Text color="$accent1">Subscribe</Text>
									</XStack>
									<Text variant="body3" color="$neutral2">
										Transact even on low balances.
									</Text>
								</YStack>
							</XStack>
							<RotatableChevron direction="right" />
						</XStack>
					</TouchableArea>
				)}
			</YStack>
			<YStack gap="$sm" mt="$lg" width="92%">
				<YStack
					bg="$surface1"
					width="100%"
					px="$sm"
					pt="$md"
					pb="$xl"
					rounded="$lg"
					gap="$md"
				>
					<Text color="$neutral2" pl="$xs">
						Shillings
					</Text>
					{!shillingsWithBal.length ? (
						<TouchableArea onPress={() => {}}>
							<TokenItem
								tokenInfo={{
									name: defaultShilling.name,
									symbol: defaultShilling.symbol,
									logoUrl: defaultShilling.logo,
									chainId: defaultShilling.chainId,
								}}
								amount={{
									actual: defaultShilling.balance,
									inUSD: defaultShilling.balanceUSD,
								}}
							/>
						</TouchableArea>
					) : (
						shillingsWithBal.map((item) => {
							const tokenId = `${item.symbol}_${item.chainId}`;
							return (
								<TouchableArea key={tokenId} onPress={() => {}}>
									<TokenItem
										tokenInfo={{
											name: item.name,
											symbol: item.symbol,
											logoUrl: item.logo,
											chainId: item.chainId,
										}}
										amount={{
											actual: item.balance,
											inUSD: item.balanceUSD,
										}}
									/>
								</TouchableArea>
							);
						})
					)}
				</YStack>
				<YStack
					bg="$surface1"
					width="100%"
					px="$sm"
					pt="$md"
					pb="$xl"
					rounded="$lg"
					gap="$md"
				>
					<Text color="$neutral2" pl="$xs">
						Dollars
					</Text>
					{!dollarsWithBal.length ? (
						<TouchableArea onPress={() => {}}>
							<TokenItem
								tokenInfo={{
									name: defaultDollar?.name,
									symbol: defaultDollar.symbol,
									logoUrl: defaultDollar.logo,
									chainId: defaultDollar.chainId,
								}}
								amount={{
									actual: defaultDollar.balance,
									inUSD: defaultDollar.balanceUSD,
								}}
							/>
						</TouchableArea>
					) : (
						dollarsWithBal.map((item) => {
							const tokenId = `${item.symbol}_${item.chainId}`;
							return (
								<TouchableArea key={tokenId} onPress={() => {}}>
									<TokenItem
										tokenInfo={{
											name: item.name,
											symbol: item.symbol,
											logoUrl: item.logo,
											chainId: item.chainId,
										}}
										amount={{
											actual: item.balance,
											inUSD: item.balanceUSD,
										}}
									/>
								</TouchableArea>
							);
						})
					)}
				</YStack>
			</YStack>
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
		</Screen>
	);
}

const JazishaContent = ({
	onPressButton,
	isLoading,
	balance,
}: {
	onPressButton: () => void;
	isLoading: boolean;
	balance: string;
}) => {
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
					Transfer or make a payment even on low balance with Pasha
					Overdraft.
				</Text>
			</YStack>
			{Number(balance) > 0 ? (
				<YStack width="70%" gap="$2xs" items="center">
					<Text>Available:</Text>
					<Text variant="heading3" fontWeight="600">
						{balance}/100 USD
					</Text>
					<Text color="$neutral2">Only on Avalanche</Text>
				</YStack>
			) : null}
			<TouchableArea
				onPress={() =>
					openBrowserAsync("https://clixpesa.com/feature/overdraft")
				}
			>
				<XStack items="center" gap="$xs">
					<Text variant="subHeading1" color="$accent1">
						Learn more
					</Text>
					<ExternalLink size={24} color="$accent1" />
				</XStack>
			</TouchableArea>
			<Button
				size="lg"
				variant="branded"
				emphasis={Number(balance) > 0 ? "secondary" : "primary"}
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

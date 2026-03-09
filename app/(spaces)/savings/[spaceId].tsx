import { BackButton } from "@/components/Buttons/BackButton";
import type { SpaceInfo } from "@/features/contracts/goal-savings";
import { getSavings } from "@/features/contracts/goal-savings";
import { TransactionsCard } from "@/features/spaces/components/TransactionsCard";
import { useSpacesState } from "@/features/spaces/spacesState";
import {
	getChainInfo,
	getRate,
	usePublicClient,
	useWalletContext,
} from "@/features/wallet";
import { useEnabledChains, useEnabledTokens } from "@/features/wallet/hooks";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	IconButton,
	LinearGradient,
	Stack,
	Text,
	TouchableArea,
	View,
	XStack,
	YStack,
} from "@/ui";
import { ReceiveAlt, SendAction, Settings } from "@/ui/components/icons";
import { isSameAddress } from "@/utilities/addresses";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Progress } from "tamagui";
import { decodeEventLog, formatUnits } from "viem";

export default function SpaceHome() {
	const params = useLocalSearchParams();
	const currency = useWalletState((s) => s.currency);
	const getSpaceTxs = useSpacesState((s) => s.getSpaceTxs);
	const { defaultChainId } = useEnabledChains();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { symbol, conversionRate } = getRate(currency);
	const chain = getChainInfo(defaultChainId);
	const [spaceInfo, setSpaceInfo] = useState<SpaceInfo>({
		spaceId: params.spaceId as string,
		name: params.name as string,
		amount: Number(params.amount) | 0,
		yield: Number(params.amount) | 0,
		targetAmount: Number(params.targetAmount),
		targetDate: Number(params.targetDate),
	});
	const isTarget = spaceInfo.amount === spaceInfo.targetAmount;
	const date: Date = new Date(spaceInfo.targetDate);
	const balInCurreny = spaceInfo.amount * conversionRate;
	const balSplit = balInCurreny.toFixed(2).split(".");
	const progress = Number(
		((spaceInfo.amount / spaceInfo.targetAmount) * 100).toFixed(0),
	);
	const publicClient = usePublicClient();
	const allTokens = useEnabledTokens();
	const supportedTokens = allTokens.filter(
		(token) => token.chainId === defaultChainId,
	);
	const { mainAccount } = useWalletContext();
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		setIsLoading(true);
		const getSpace = async () => {
			const savings = await getSavings({
				chainId: defaultChainId,
				spaceId: spaceInfo.spaceId,
			});
			if (savings) setSpaceInfo(savings);
			const txHashs = getSpaceTxs(spaceInfo.spaceId);
			const txs = await handleTxs(txHashs.reverse());
			setTransactions(txs);
			setIsLoading(false);
		};
		getSpace();
	}, [defaultChainId, spaceInfo.spaceId]);

	const handleTxs = async (txHashs) => {
		try {
			const transferEventAbi = {
				type: "event",
				name: "Transfer",
				inputs: [
					{ name: "from", type: "address", indexed: true },
					{ name: "to", type: "address", indexed: true },
					{ name: "value", type: "uint256", indexed: false },
				],
			} as const;
			const txs = [];
			for (const txHash of txHashs) {
				const tx = await publicClient?.getTransactionReceipt({
					hash: txHash,
				});
				const block = await publicClient?.getBlock({
					blockNumber: tx?.blockNumber,
				});
				const transfers = tx.logs
					.map((log) => {
						try {
							const decoded = decodeEventLog({
								abi: [transferEventAbi],
								data: log.data,
								topics: log.topics,
							});
							const token = supportedTokens.find((token) =>
								isSameAddress(token.address, log.address),
							);
							const amount = formatUnits(
								decoded.args.value,
								Number(token?.decimals),
							);
							const aTx = decoded.args
								? {
										id: tx?.transactionHash.slice(0, 10),
										title: isSameAddress(
											decoded.args.to,
											mainAccount.account.address,
										)
											? `Cashed out ${token?.symbol}`
											: `Added ${token?.symbol}`,

										amount: Number(amount),
										amountUSD:
											token?.symbol.includes("SH") ||
											token?.symbol.includes("KES")
												? Number(amount) / conversionRate
												: Number(amount),
										tokenId: `${token?.symbol}_${token?.chainId}`,
										date: new Date(
											Number(block?.timestamp) * 1000,
										).toLocaleDateString("en-US", {
											weekday: "short",
											day: "numeric",
											month: "short",
											year: "numeric",
										}),
									}
								: null;
							return aTx;
						} catch (e) {
							return null; // Not a Transfer event
						}
					})
					.filter(Boolean); // Remove nulls
				txs.push(...transfers);
			}
			return txs;
		} catch (error) {
			console.log(error);
		}
	};

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
					<Stack position="absolute" t="$lg" l="$lg">
						<BackButton
							color="$neutral2"
							size={28}
							onPressBack={() => router.replace("/(tabs)/spaces")}
						/>
					</Stack>
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
									≈ ${(spaceInfo.amount - spaceInfo.yield).toFixed(2)}
								</Text>
								<TouchableArea
									bg="$tealThemed"
									rounded="$full"
									py="$4xs"
									px="$sm"
									onPress={() => {}}
								>
									<Text variant="subHeading2" color="$neutral1">
										+{spaceInfo.yield.toFixed(2)}
									</Text>
								</TouchableArea>
							</XStack>
						</YStack>
					</YStack>
					<IconButton
						icon={<Settings size={24} color="$accent1" />}
						size="md"
						variant="branded"
						emphasis="secondary"
						onPress={() =>
							router.navigate({
								pathname: "/(spaces)/savings/settings",
								params: {
									spaceId: spaceInfo.spaceId,
									name: spaceInfo.name,
									goal: spaceInfo.targetAmount,
									deadline: spaceInfo.targetDate,
								},
							})
						}
					/>
				</XStack>
				<YStack
					gap="$sm"
					width="92%"
					px="$sm"
					pt="$md"
					pb="$xl"
					rounded="$lg"
					bg="$surface1"
				>
					<XStack justify="space-between">
						<Text fontWeight="$md">Saved ${spaceInfo.amount.toFixed(2)}</Text>
						<Text>Target: ${spaceInfo.targetAmount.toFixed(2)}</Text>
					</XStack>
					<Progress value={progress} height="$xs" bg="$tealThemed">
						<Progress.Indicator bg="$tealBase" animation="80ms-ease-in-out" />
					</Progress>
					<Text>
						{date.toLocaleDateString("en-US", {
							weekday: "short",
							day: "numeric",
							month: "short",
							year: "numeric",
						})}
						{/*<Text color="$neutral2">- 1 month to go</Text>*/}
					</Text>
				</YStack>
				<TransactionsCard transactions={transactions} isLoading={isLoading} />
			</YStack>
			<XStack justify="space-between" position="absolute" b="$3xl" width="92%">
				<Button
					variant="branded"
					emphasis={spaceInfo.amount > 0 ? "secondary" : "primary"}
					size="lg"
					width={spaceInfo.amount > 0 ? (isTarget ? "25%" : "48%") : "72%"}
					icon={<SendAction size={24} />}
					onPress={() =>
						router.navigate({
							pathname: "/(spaces)/add-cash",
							params: {
								address: chain.contracts?.goalSavings.address,
								name: spaceInfo.name,
								id: spaceInfo.spaceId,
							},
						})
					}
				>
					{isTarget ? null : "Add Cash"}
				</Button>
				<Button
					variant="branded"
					emphasis={isTarget ? "primary" : "secondary"}
					size="lg"
					width={spaceInfo.amount > 0 ? (isTarget ? "72%" : "48%") : "25%"}
					icon={<ReceiveAlt size={24} />}
					onPress={() =>
						router.navigate({
							pathname: "/(spaces)/cash-out",
							params: {
								address: chain.contracts?.goalSavings.address,
								name: spaceInfo.name,
								id: spaceInfo.spaceId,
							},
						})
					}
				>
					{spaceInfo.amount > 0 ? "Cash Out" : null}
				</Button>
			</XStack>
		</View>
	);
}

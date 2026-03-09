import { AccountIcon } from "@/components/account/AccountIcon";
import { TokenLogo } from "@/components/logos/TokenLogo";
import {
	getChainInfo,
	getRate,
	useGetRateQuery,
	usePublicClient,
	useWalletContext,
} from "@/features/wallet";
import { useOnrampXMutation } from "@/features/wallet/transactions/ramps";
import { getProviderInfo } from "@/features/wallet/transactions/supportedProviders";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	LinearGradient,
	Separator,
	SpinningLoader,
	Stack,
	Text,
	UniversalImage,
	UniversalImageResizeMode,
	View,
	XStack,
	YStack,
} from "@/ui";
import { CheckmarkCircle } from "@/ui/components/icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useLayoutEffect, useState } from "react";
import { createPublicClient, http, parseAbi, parseAbiItem } from "viem";

export default function TransactScreen() {
	const params = useLocalSearchParams();
	const currency = useWalletState((s) => s.currency);
	const onramp = useWalletState((s) => s.onramp);
	const [isLoading, setIsLoading] = useState(true);
	const [txHash, setTxHash] = useState<string | null>(null);
	const [providerInfo, setProviderInfo] = useState<any>();
	const amount = Number(params.amount);
	const tokenInfo = JSON.parse(params.tokenInfo as string);
	const chain = getChainInfo(tokenInfo.chainId);
	const { symbol, conversionRate } = getRate(currency);
	const { mainAccount } = useWalletContext();
	const publicClient = usePublicClient();
	const [onrampWithXwift, { reset: resetX, data: dataX }] =
		useOnrampXMutation();
	const { data: ratesData, isSuccess } = useGetRateQuery(currency);
	//console.log(ratesData, Number(amount) * ratesData?.buying_rate);
	useEffect(() => {
		setIsLoading(true);
		const methodId = onramp.method;
		const providerId = onramp.provider;
		const providerInfo = getProviderInfo(methodId, providerId);
		setProviderInfo(providerInfo);
	}, [onramp]);

	useEffect(() => {
		(async () => {
			//console.log("Calling Provider Info:", providerInfo);
			if (providerInfo && isSuccess) {
				try {
					onrampWithXwift({
						amount: Number(amount) * ratesData?.buying_rate,
						phone: onramp?.details?.[onramp.provider].accountNumber,
						tokenId: `${tokenInfo.symbol}_${chain.name.toUpperCase()}`,
						address: mainAccount?.account?.address,
					});
				} catch (error) {
					console.error("Onramp Xwift error:", error);
				} finally {
					//setIsLoading(false);
				}
			}
		})();
	}, [providerInfo]);

	useEffect(() => {
		let unwatch: (() => void) | null = null;
		let pollInterval: NodeJS.Timeout | null = null;
		let isCompleted = false;

		const cleanup = () => {
			if (unwatch) unwatch();
			if (pollInterval) clearInterval(pollInterval);
		};

		const handleSuccess = (txHash: string) => {
			isCompleted = true;
			setTxHash(txHash);
			setIsLoading(false);
			cleanup();
		};

		if (dataX?.code === 200) {
			if (isCompleted) return;
			try {
				const publicClient = createPublicClient({
					chain: chain,
					transport: http(
						`https://${tokenInfo.chainId}.rpc.thirdweb.com/c9f58f940343e75c35e9e07f93acc785`,
					),
				});
				const transferEvent = parseAbiItem(
					"event Transfer(address indexed from, address indexed to, uint256 value)",
				);

				// Event watcher (faster if supported)
				try {
					unwatch = publicClient.watchContractEvent({
						address: [tokenInfo.address],
						abi: parseAbi([
							"event Transfer(address indexed from, address indexed to, uint256 value)",
						]),
						eventName: "Transfer",
						args: {
							to: mainAccount?.account?.address,
						},
						onLogs: (logs) => {
							if (logs[0]?.transactionHash) {
								handleSuccess(logs[0].transactionHash);
							}
						},
						onError: (error) => {
							console.warn("Watch event error, relying on polling:", error);
						},
					});
				} catch (error) {
					console.warn("Watch event not supported, using polling only:", error);
				}

				// Polling fallback (runs regardless of watch status)
				pollInterval = setInterval(async () => {
					if (isCompleted) return;

					try {
						const logs = await publicClient.getLogs({
							address: tokenInfo.address,
							event: transferEvent,
							args: { to: mainAccount?.account?.address },
							fromBlock: "latest",
						});

						if (logs.length > 0 && logs[0]?.transactionHash) {
							handleSuccess(logs[0].transactionHash);
						}
					} catch (error) {
						console.error("Polling error:", error);
					}
				}, 1000);
			} catch (error) {
				console.error("Setup error:", error);
				setIsLoading(false);
			}
		}

		return () => {
			cleanup();
		};
	}, [dataX, chain]);

	//header options
	const navigation = useNavigation();
	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false,
		});
	}, [navigation]);
	return (
		<View flex={1} items="center" bg="$surface1" justify="center">
			<LinearGradient
				width="100%"
				height="100%"
				colors={["$surface1", "$surface3"]}
				position="absolute"
			/>
			{isLoading ? (
				<YStack gap="$sm" items="center">
					<XStack gap="$md">
						<Stack
							rounded="$xl"
							height={80}
							width={80}
							z={10}
							overflow="hidden"
						>
							<UniversalImage
								uri={require("@/ui/assets/images/icon.png")}
								size={{
									height: 80,
									width: 80,
									resizeMode: UniversalImageResizeMode.Contain,
								}}
							/>
						</Stack>
						<Stack
							rounded="$xl"
							height={80}
							width={80}
							z={10}
							overflow="hidden"
						>
							<UniversalImage
								uri={providerInfo?.logo}
								size={{
									height: 80,
									width: 80,
									resizeMode: UniversalImageResizeMode.Contain,
								}}
							/>
						</Stack>
					</XStack>
					<SpinningLoader />
					<YStack items="center" gap="$xs">
						<Text variant="subHeading1">
							Connecting you to{" "}
							{providerInfo?.name.charAt(0).toUpperCase() +
								providerInfo?.name.slice(1)}
						</Text>
						<Text>
							{`Buying ${symbol} ${
								tokenInfo.symbol.includes("USD")
									? (Number(amount) * ratesData?.buying_rate).toFixed(2)
									: amount.toFixed(2)
							} worth of ${tokenInfo.symbol}`}
						</Text>
					</YStack>
				</YStack>
			) : (
				<YStack gap="$md" width="85%" mb="$5xl">
					<YStack gap="$md">
						<CheckmarkCircle color="$statusSuccess" size={80} self="center" />
						<Text text="center">Your transfer was successfull!</Text>
					</YStack>
					<Text text="center" variant="subHeading1">
						You've added
					</Text>
					<XStack width="100%" justify="space-between" items="center" pr="$2xs">
						<YStack>
							<Text variant="heading3" color="$neutral1">
								{amount.toFixed(3)} {tokenInfo.symbol}
							</Text>
							<Text color="$neutral2">
								{`${symbol} ${
									tokenInfo.symbol.includes("USD")
										? (Number(amount) * ratesData?.buying_rate).toFixed(2)
										: amount.toFixed(2)
								}`}
							</Text>
						</YStack>
						<TokenLogo
							chainId={tokenInfo.chainId}
							symbol={tokenInfo.symbol}
							url={tokenInfo.logo}
							size={42}
						/>
					</XStack>
					<XStack width="92%" items="center" gap="$lg">
						<Text>Via</Text>
						<Separator borderWidth={1} />
					</XStack>
					<XStack width="100%" justify="space-between" items="center" pr="$2xs">
						<YStack gap="$2xs">
							<Text variant="subHeading1">{providerInfo?.name}</Text>
							<Text color="$neutral2">
								{onramp?.details?.[onramp.provider].accountNumber}
							</Text>
						</YStack>
						<AccountIcon
							size={46}
							address="0x1BB5Bc2d6d1272C43a6823875E34c84f1B98113A"
							avatarUri={providerInfo?.logo}
						/>
					</XStack>
					<YStack gap="$xs">
						<XStack justify="space-between">
							<Text>Fee:</Text>
							<XStack gap="$xs">
								<Text
									variant="subHeading2"
									textDecorationLine="line-through"
									color="$orangeBase"
								>
									Ksh 12.00
								</Text>
								<Text variant="subHeading2">0.00</Text>
							</XStack>
						</XStack>
					</YStack>
				</YStack>
			)}
			{isLoading ? (
				<YStack
					b="$5xl"
					position="absolute"
					width="90%"
					items="center"
					gap="$md"
				>
					<Text text="center" variant="body3" color="$neutral2">
						By continuing, you acknowledge that you'll be subject to the Terms
						of Service and Privacy Policy of our Third Party provider.
					</Text>
					<Button
						size="lg"
						variant="branded"
						emphasis="secondary"
						width="86%"
						onPress={() => router.back()}
					>
						Cancel
					</Button>
				</YStack>
			) : (
				<YStack
					b="$5xl"
					gap="$md"
					position="absolute"
					width="100%"
					self="center"
					l="7%"
				>
					<Button
						size="lg"
						variant="branded"
						emphasis="tertiary"
						width="86%"
						onPress={() =>
							openBrowserAsync(
								`${chain.blockExplorers?.default.url}/tx/${txHash}`,
							)
						}
					>
						View reciept
					</Button>
					<Button
						size="lg"
						variant="branded"
						loading={isLoading}
						width="86%"
						onPress={() => router.navigate("/")}
					>
						Done
					</Button>
				</YStack>
			)}
		</View>
	);
}

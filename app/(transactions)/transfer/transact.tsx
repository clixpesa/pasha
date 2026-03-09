import { AccountIconWChainLogo } from "@/components/account/AccountIconWChainLogo";
import { TokenLogo } from "@/components/logos/TokenLogo";
import { transferTokenWithOverdraft } from "@/features/contracts/overdraft";
import { transferFunds } from "@/features/contracts/tokens";
import {
	getChainInfo,
	getRate,
	useGetRateQuery,
	useMainAccount,
} from "@/features/wallet";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	LinearGradient,
	Separator,
	Stack,
	Text,
	UniversalImage,
	View,
	XStack,
	YStack,
} from "@/ui";
import { ArrowDown, CheckmarkCircle } from "@/ui/components/icons";
import { shortenAddress } from "@/utilities/addresses";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useLayoutEffect, useState } from "react";
import type { Address } from "viem";

export default function TransactScreen() {
	const params = useLocalSearchParams();
	const currency = useWalletState((s) => s.currency);
	const mainAccount = useMainAccount();
	const { symbol } = getRate(currency);
	const amount = Number(params.amount);
	const tokenInfo = JSON.parse(params.tokenInfo as string);
	const recipient = JSON.parse(params.recipient as string);
	const [isLoading, setIsLoading] = useState(true);
	const [txHash, setTxHash] = useState<string | null>(null);
	const chain = getChainInfo(tokenInfo.chainId);

	const { data: ratesData, isSuccess } = useGetRateQuery(currency);
	const conversionRate = ratesData?.selling_rate;

	useEffect(() => {
		(async () => {
			//console.log("Calling Provider Info:", providerInfo);
			if (mainAccount && isSuccess && params && isLoading) {
				try {
					if (params.isOverdraft === "false") {
						console.log("tranfering tokens");
						const txHash = await transferFunds({
							account: mainAccount,
							recipient: recipient.address as Address,
							token: tokenInfo,
							amount: params.amount as string,
						});
						setTxHash(txHash);
						setIsLoading(false);
					} else if (params.isOverdraft === "true") {
						console.log("Transfering with overdraft");
						const txHash = await transferTokenWithOverdraft({
							account: mainAccount,
							to: recipient.address as Address,
							tokenId: `${tokenInfo.symbol}_${chain.id}`,
							amount: params.amount as string,
						});
						setTxHash(txHash);
						setIsLoading(false);
					}
				} catch (error) {
					console.error("Error sending tokens:", error);
				} finally {
					//setIsLoading(false);
				}
			}
		})();
	}, [mainAccount, params]);

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
			<YStack gap="$md" width="85%" mb="$5xl">
				{isLoading ? (
					<Stack self="center" mr="$xl">
						<UniversalImage
							uri={require("@/ui/assets/gifs/send.gif")}
							size={{ height: 80, width: 80 }}
						/>
					</Stack>
				) : (
					<YStack gap="$md">
						<CheckmarkCircle color="$statusSuccess" size={80} self="center" />
						<Text text="center">Your transfer was successfull!</Text>
					</YStack>
				)}
				<Text text="center" variant="subHeading1">
					{isLoading ? "You're sending..." : "You sent"}
				</Text>
				<XStack width="100%" justify="space-between" items="center" pr="$2xs">
					<YStack>
						<Text variant="heading3" color={"$neutral1"}>
							{amount.toFixed(3)} {tokenInfo.symbol}
						</Text>
						<Text color={"$neutral2"}>
							{symbol}{" "}
							{tokenInfo.symbol.includes("USD")
								? (Number(amount) * conversionRate).toFixed(2)
								: amount.toFixed(2)}
						</Text>
					</YStack>
					<TokenLogo
						chainId={tokenInfo.chainId}
						symbol={tokenInfo.symbol}
						url={tokenInfo.logo}
						size={42}
					/>
				</XStack>
				{isLoading ? (
					<Stack self="center">
						<UniversalImage
							uri={require("@/ui/assets/gifs/arrow-down.gif")}
							size={{ height: 30, width: 30 }}
						/>
					</Stack>
				) : (
					<ArrowDown size={30} color="$neutral2" self="center" />
				)}
				<XStack width="100%" justify="space-between" items="center" pr="$2xs">
					<YStack gap="$2xs">
						<Text variant="subHeading1">{recipient.name}</Text>
						<Text color="$neutral2">
							{recipient.name.startsWith("0x")
								? "External Address"
								: shortenAddress(recipient.address, 5)}
						</Text>
					</YStack>
					<AccountIconWChainLogo
						size={46}
						address={recipient.address}
						chainId={tokenInfo.chainId}
					/>
				</XStack>
				{isLoading ? null : (
					<YStack gap="$md">
						<Separator />
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
				<YStack
					mt={isLoading ? "30%" : "$6xl"}
					mb="$3xl"
					gap="$md"
					width="100%"
				>
					{!isLoading && (
						<Button
							size="lg"
							variant="branded"
							emphasis="tertiary"
							width="100%"
							onPress={() =>
								openBrowserAsync(
									`${chain.blockExplorers?.default.url}/tx/${txHash}`,
								)
							}
						>
							View reciept
						</Button>
					)}
					<Button
						size="lg"
						variant="branded"
						loading={isLoading}
						width="100%"
						onPress={() => router.navigate("/")}
					>
						{isLoading ? "Sending..." : "Done"}
					</Button>
				</YStack>
			</YStack>
		</View>
	);
}

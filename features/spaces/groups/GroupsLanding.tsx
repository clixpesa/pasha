import {
	type GroupSpaceInfo,
	frequencyOptions,
	getUserRoscas,
} from "@/features/contracts/roscas";
import { useAppState } from "@/features/essentials/appState";
import { getRate, getTokensByChainId } from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	Separator,
	Spacer,
	Stack,
	Text,
	TouchableArea,
	Unicon,
	UniversalImage,
	UniversalImageResizeMode,
	View,
	XStack,
	YStack,
} from "@/ui";
import { ExternalLink, GroupFill, RoscaFill } from "@/ui/components/icons";
import { isSameAddress } from "@/utilities/addresses";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useState } from "react";
import type { Address } from "viem";

export function GroupsLanding() {
	const user = useAppState((s) => s.user);
	const { defaultChainId } = useEnabledChains();
	const currency = useWalletState((s) => s.currency);
	const { symbol, conversionRate } = getRate(currency);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [spaces, setSpaces] = useState<GroupSpaceInfo[]>([]);
	const tokens = getTokensByChainId(defaultChainId);
	const iconSize = 42;

	useEffect(() => {
		setIsLoading(true);
		const getSpaces = async () => {
			const savings = await getUserRoscas({
				chainId: defaultChainId,
				address: user.mainAddress as Address,
			});
			if (savings.length) setSpaces(savings);
			setIsLoading(false);
		};
		getSpaces();
	}, [defaultChainId, user.mainAddress]);

	return (
		<View flex={1} items="center" bg="$surface1" py="$3xl">
			{spaces.length === 0 && !isLoading ? (
				<>
					<YStack
						width="92%"
						p="$md"
						bg="$surface3"
						rounded="$xl"
						opacity={0.85}
						gap="$xl"
					>
						<XStack gap="$md">
							<Stack
								bg="$neutral3"
								height={42}
								rounded="$full"
								width={42}
								items="center"
								justify="center"
							>
								<GroupFill size={32} color="$surface1" />
							</Stack>
							<Stack width="83%">
								<Text variant="subHeading2">Save with family and friends</Text>
								<Text variant="body3" color="$neutral2">
									Save in groups and reach your goals together or challenge one
									another.
								</Text>
							</Stack>
						</XStack>
						<XStack gap="$md">
							<Stack
								bg="$neutral3"
								height={42}
								rounded="$full"
								width={42}
								items="center"
								justify="center"
							>
								<RoscaFill size={30} color="$surface1" />
							</Stack>
							<Stack width="83%">
								<Text variant="subHeading2">Join or create saving circles</Text>
								<Text variant="body3" color="$neutral2">
									Save in a circle and let your crew help you reach your goals.
								</Text>
							</Stack>
						</XStack>
					</YStack>
					<TouchableArea
						onPress={() =>
							openBrowserAsync("https://clixpesa.com/feature/roscas")
						}
					>
						<XStack items="center" gap="$xs" mt="$md">
							<Text variant="subHeading1" color="$accent1">
								Learn more
							</Text>
							<ExternalLink size={24} color="$accent1" />
						</XStack>
					</TouchableArea>
					<Spacer height="10%" />
					<YStack gap="$sm" width="85%" items="center">
						<Button
							variant="branded"
							size="lg"
							width="100%"
							onPress={() => router.navigate("/(spaces)/roscas/create")}
						>
							Create a group
						</Button>
						<Button
							variant="branded"
							emphasis="secondary"
							size="lg"
							width="100%"
							onPress={() => router.navigate("/(spaces)/roscas/join")}
						>
							Join a group
						</Button>
					</YStack>
				</>
			) : (
				<YStack gap="$xs" width="92%">
					{spaces.map((item) => {
						const spaceToken = tokens.find((token) =>
							isSameAddress(token.address, item.token),
						);
						const isUSD = spaceToken?.symbol.includes("USD");
						const endTime =
							item.startDate + item.interval * (item.memberCount - 1);
						const date: Date = new Date(endTime * 1000);
						return (
							<TouchableArea
								key={item.spaceId}
								onPress={() =>
									router.navigate({
										pathname: "/(spaces)/roscas/[spaceId]",
										params: {
											...item,
										},
									})
								}
							>
								<YStack
									gap="$xs"
									borderWidth={1}
									borderBottomWidth={3}
									borderColor="$surface3"
									p="$md"
									rounded="$md"
									bg="$surface1"
									key={item.spaceId}
								>
									<XStack justify="space-between" items="center">
										<YStack gap="$2xs">
											<Text variant="subHeading2">{item.name}</Text>
											<Text variant="body3">
												{isUSD ? "$" : symbol}
												{(item.payoutAmount / item.memberCount).toFixed(2)}{" "}
												<Text color="$neutral2" variant="body3">
													{
														frequencyOptions.find(
															(frq) => frq.interval === item.interval,
														)?.name
													}
												</Text>
											</Text>
										</YStack>
										<XStack>
											<UniversalImage
												style={{ image: { borderRadius: iconSize } }}
												fallback={
													<Unicon address={item.admin} size={iconSize} />
												}
												size={{
													width: iconSize,
													height: iconSize,
													resizeMode: UniversalImageResizeMode.Cover,
												}}
												uri={""}
											/>
											<Stack ml={-10}>
												<UniversalImage
													style={{ image: { borderRadius: iconSize } }}
													fallback={
														<Unicon
															address={
																isSameAddress(user.mainAddress, item.admin)
																	? "0x765DE816845861e75B25fCA122bb6899B8B1282a"
																	: (user.mainAddress as Address)
															}
															size={iconSize}
														/>
													}
													size={{
														width: iconSize,
														height: iconSize,
														resizeMode: UniversalImageResizeMode.Cover,
													}}
													uri={""}
												/>
											</Stack>
											<YStack ml={2}>
												<Text>+{item.memberCount - 2}</Text>
												<Text variant="body3">others</Text>
											</YStack>
										</XStack>
									</XStack>
									<XStack items="center" mt="$2xs">
										<Text mr="$sm" variant="body3">
											Payout
										</Text>
										<Separator />
									</XStack>
									<XStack justify="space-between" items="center">
										<Text variant="subHeading1">
											{isUSD ? "$" : symbol}
											{item.payoutAmount.toFixed(2)}
										</Text>
										<Text variant="body3">
											<Text color="$neutral2" variant="body3">
												Ends:
											</Text>{" "}
											{date.toLocaleDateString("en-US", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</Text>
									</XStack>
								</YStack>
							</TouchableArea>
						);
					})}
				</YStack>
			)}
		</View>
	);
}

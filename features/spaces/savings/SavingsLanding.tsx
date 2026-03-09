import { AccountIcon } from "@/components/account/AccountIcon";
import {
	type SpaceInfo,
	getGoalSavings,
} from "@/features/contracts/goal-savings";
import { useAppState } from "@/features/essentials/appState";
import { useEnabledChains } from "@/features/wallet/hooks";
import {
	ActivityLoader,
	Button,
	Spacer,
	Stack,
	Text,
	TouchableArea,
	View,
	XStack,
	YStack,
} from "@/ui";
import { ExternalLink, MoneyFill, SafeFill } from "@/ui/components/icons";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useState } from "react";
import { Progress } from "tamagui";
import type { Address } from "viem";

export function SavingsLanding() {
	const user = useAppState((s) => s.user);
	const { defaultChainId } = useEnabledChains();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [spaces, setSpaces] = useState<SpaceInfo[]>([]);

	useEffect(() => {
		setIsLoading(true);
		const getSpaces = async () => {
			const savings = await getGoalSavings({
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
			{isLoading ? (
				<YStack
					borderWidth={1}
					borderColor="$surface3"
					p="$md"
					rounded="$lg"
					width="92%"
				>
					<ActivityLoader opacity={0.8} />
					<YStack gap="$vs" mt="$xs">
						<Progress value={60} height="$xs" bg="$surface2">
							<Progress.Indicator bg="$surface3" animation="80ms-ease-in-out" />
						</Progress>
					</YStack>
				</YStack>
			) : spaces.length === 0 && !isLoading ? (
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
								<SafeFill size={28} color="$surface1" />
							</Stack>
							<Stack width="83%">
								<Text variant="subHeading2">
									Get paid daily on your savings
								</Text>
								<Text variant="body3" color="$neutral2">
									Start saving today and put your cash to work. Earn upto 8.84%
									APY.
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
								<MoneyFill size={28} color="$surface1" />
							</Stack>
							<Stack width="83%">
								<Text variant="subHeading2">Access your money anytime</Text>
								<Text variant="body3" color="$neutral2">
									Withdraw your money anytime with no notice period.
								</Text>
							</Stack>
						</XStack>
					</YStack>
					<TouchableArea
						onPress={() =>
							openBrowserAsync("https://clixpesa.com/feature/savings")
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
					<Button
						variant="branded"
						size="lg"
						width="85%"
						onPress={() => router.navigate("/(spaces)/savings/create")}
					>
						Get started
					</Button>
				</>
			) : (
				<YStack gap="$vs" width="92%">
					{spaces.map((item) => (
						<TouchableArea
							key={item.spaceId}
							onPress={() =>
								router.navigate({
									pathname: "/(spaces)/savings/[spaceId]",
									params: {
										...item,
									},
								})
							}
						>
							<YStack
								borderWidth={1}
								borderBottomWidth={3}
								borderColor="$surface3"
								p="$md"
								rounded="$lg"
								gap="$vs"
							>
								<XStack items="center" gap="$lg">
									<AccountIcon
										size={42}
										address="0x765DE816845861e75A25fCA122bb6898B8B1282e"
									/>
									<YStack gap="$2xs">
										<Text variant="subHeading2">{item.name}</Text>
										<Text variant="body3" color="$neutral2">
											Weekly saving: $
											{(
												(item.targetAmount - item.amount) /
												((item.targetDate - Date.now().valueOf()) / 604800000)
											).toFixed(2)}
										</Text>
									</YStack>
								</XStack>
								<YStack gap="$vs">
									<XStack justify="space-between">
										<Text variant="body3" fontWeight="$md">
											${item.amount.toFixed(2)}
										</Text>
										<Text color="$neutral2" variant="body3">
											Target: ${item.targetAmount.toFixed(2)}
										</Text>
									</XStack>
									<Progress
										value={Number(
											((item.amount / item.targetAmount) * 100).toFixed(0),
										)}
										height="$xs"
										bg="$tealThemed"
									>
										<Progress.Indicator
											bg="$tealBase"
											animation="80ms-ease-in-out"
										/>
									</Progress>
								</YStack>
							</YStack>
						</TouchableArea>
					))}
				</YStack>
			)}
		</View>
	);
}

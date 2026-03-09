import { Stack, Text, TouchableArea, XStack, YStack } from "@/ui";
import { BizPurse, CoinsFill } from "@/ui/components/icons";
import { router } from "expo-router";

export const ProductsCard = () => {
	return (
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
				Some products for you
			</Text>
			<XStack items="center" justify="space-between">
				<Stack
					bg="$greenVibrant"
					height={42}
					rounded="$md"
					width={42}
					items="center"
					justify="center"
				>
					<CoinsFill size={28} color="$surface1" />
				</Stack>
				<YStack width="58%" gap="$2xs">
					<Text variant="subHeading2">Earn Interest</Text>
					<Text variant="body3" color="$neutral2">
						Earn upto 8.84% APY
					</Text>
				</YStack>
				<TouchableArea
					py="$vs"
					px="$md"
					bg="$accent2"
					rounded="$full"
					onPress={() => router.navigate("/(tabs)/spaces")}
				>
					<Text variant="buttonLabel2" color="$accent1">
						Open
					</Text>
				</TouchableArea>
			</XStack>
			<XStack items="center" mt="$sm" justify="space-between">
				<Stack
					bg="$blueBase"
					height={42}
					rounded="$md"
					width={42}
					items="center"
					justify="center"
				>
					<BizPurse size={28} color="$surface1" />
				</Stack>
				<YStack width="58%" gap="$2xs">
					<Text variant="subHeading2">Biz Purse</Text>
					<Text variant="body3" color="$neutral2">
						Seperate your Personal and Business funds.
					</Text>
				</YStack>
				<TouchableArea
					py="$vs"
					px="$md"
					bg="$accent2"
					rounded="$full"
					onPress={() => router.navigate("/(transactions)/ramps/purse")}
				>
					<Text variant="buttonLabel2" color="$accent1">
						Open
					</Text>
				</TouchableArea>
			</XStack>
			{/*
				<XStack items="center" mt="$sm" justify="space-between">
				<Stack
					bg="$blueBase"
					height={42}
					rounded="$md"
					width={42}
					items="center"
					justify="center"
				>
					<HandCoinFill size={28} color="$surface1" />
				</Stack>
				<YStack width="58%" gap="$2xs">
					<Text variant="subHeading2">Short term Loans</Text>
					<Text variant="body3" color="$neutral2">
						Borrow for as low as 7.5%
					</Text>
				</YStack>
				<TouchableArea py="$vs" px="$md" bg="$accent2" rounded="$full">
					<Text variant="buttonLabel2" color="$accent1">
						Open
					</Text>
				</TouchableArea>
			*/}
		</YStack>
	);
};

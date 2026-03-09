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
import { ExternalLink, MoneyFill, BarchartFill } from "@/ui/components/icons";
import { router } from "expo-router";

export function PortfolioLanding() {
	return (
		<View flex={1} items="center" bg="$surface1" py="$3xl">
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
						<BarchartFill size={28} color="$surface1" />
					</Stack>
					<Stack width="83%">
						<Text variant="subHeading2">Invest in 500+ tokens and stocks</Text>
						<Text variant="body3" color="$neutral2">
							Start investing today and put your cash to work. Build your
							passive income.
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
			<TouchableArea onPress={() => console.log("saving explanation")}>
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
				isDisabled={true}
				size="lg"
				width="85%"
				onPress={() => router.navigate("/(spaces)/savings/create")}
			>
				Coming soon!
			</Button>
		</View>
	);
}

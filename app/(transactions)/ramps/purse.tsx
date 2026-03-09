import { ParallaxScrollView } from "@/components/layout/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Button, Spacer, Stack, Text, View, XStack, YStack } from "@/ui";
import { BizPurse, LinkHorizontalAlt, MoneyFill } from "@/ui/components/icons";
import { HeaderBackButton } from "@react-navigation/elements";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function BizPurseScreen() {
	return (
		<ParallaxScrollView
			header={<Header />}
			headerContent={
				<>
					<IconSymbol
						size={310}
						color="#d4d4d4"
						name="chevron.left.forwardslash.chevron.right"
						style={styles.headerImage}
					/>
					<Text
						self="center"
						t={106}
						variant="heading2"
						fontWeight="700"
						color="$neutral2"
					>
						Coming Soon
					</Text>
				</>
			}
		>
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
							<BizPurse size={28} color="$surface1" />
						</Stack>
						<Stack width="83%">
							<Text variant="subHeading2">Dedicated for Business</Text>
							<Text variant="body3" color="$neutral2">
								Receive payments from your customers into a separate "business
								wallet"
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
							<LinkHorizontalAlt size={28} color="$surface1" />
						</Stack>
						<Stack width="83%">
							<Text variant="subHeading2">Request payments from customers</Text>
							<Text variant="body3" color="$neutral2">
								Send payment links to your customers for payments at anytime,
								anywhere
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
				<Spacer height="10%" />
				<Button
					variant="branded"
					size="lg"
					width="85%"
					isDisabled={true}
					onPress={() => {}}
					mb="$md"
				>
					Request
				</Button>
				<Button
					variant="branded"
					size="lg"
					width="85%"
					isDisabled={true}
					onPress={() => {}}
				>
					Transfer
				</Button>
			</View>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: "#d4d4d4",
		bottom: -90,
		left: -35,
		position: "absolute",
	},
	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
});

const Header = () => {
	return (
		<XStack gap="$sm" items="center" width="100%" p="$xs">
			<HeaderBackButton onPress={() => router.navigate("/")} />
			<Text variant="subHeading1" fontWeight="$md" color="$neutral1">
				Biz Purse
			</Text>
		</XStack>
	);
};

import { Screen } from "@/components/layout/Screen";
import {
	Button,
	Separator,
	Spacer,
	Stack,
	Text,
	Unicon,
	UniversalImage,
	UniversalImageResizeMode,
	XStack,
	YStack,
} from "@/ui";
import {
	CalendarEvent,
	CoinStack,
	Medal,
	Participants,
	RoscaFill,
	SwapCoin,
} from "@/ui/components/icons";
import { useLocalSearchParams } from "expo-router";

export default function GroupOverview() {
	const params = useLocalSearchParams();
	const iconSize = 42;
	return (
		<Screen>
			<YStack items="center" gap="$md" width="92%">
				<Stack
					bg="$accent2"
					height={60}
					rounded="$md"
					width={60}
					items="center"
					justify="center"
				>
					{params.type === "rosca" ? (
						<RoscaFill size={32} color="$accent1" />
					) : (
						<Medal size={32} color="$accent1" />
					)}
				</Stack>
				<YStack gap="$2xs" items="center">
					<Text variant="subHeading1" fontSize={24}>
						{params.name}
					</Text>
					<Text color="$neutral2">
						{params.type === "rosca" ? "Monthly Chama" : "Group Challenge"}
					</Text>
				</YStack>
				<Separator width="92%" mt="$3xl" />
				<XStack justify="space-between" width="92%">
					<XStack items="center" gap="$sm">
						<Participants size={32} color="$neutral2" />
						<Text>{params.type === "rosca" ? "Members" : "Challengers"}</Text>
					</XStack>
					<XStack gap="$2xs">
						<UniversalImage
							style={{ image: { borderRadius: iconSize } }}
							fallback={
								<Unicon
									address={params.ownerAddress as Address}
									size={iconSize}
								/>
							}
							size={{
								width: iconSize,
								height: iconSize,
								resizeMode: UniversalImageResizeMode.Cover,
							}}
							uri={params.ownerIcon ? Number(params.ownerIcon) : ""}
						/>
						<YStack>
							<Text>+{Number(params.members) - 1}</Text>
							<Text variant="body3">others</Text>
						</YStack>
					</XStack>
				</XStack>
				<Separator width="92%" />
				<XStack justify="space-between" width="92%" items="center">
					<XStack items="center" gap="$md">
						<CoinStack size={28} color="$neutral2" />
						<Text>{params.type === "rosca" ? "Payout" : "Target"}</Text>
					</XStack>
					<Text>{`${params.amount} ${params.currency}`}</Text>
				</XStack>
				<Separator width="92%" />
				<XStack justify="space-between" width="92%" items="center">
					<XStack items="center" gap="$sm">
						<SwapCoin size={32} color="$neutral2" />
						<Text>Frequency</Text>
					</XStack>
					<YStack gap="$2xs" items="flex-end">
						<Text>
							{params.type === "rosca"
								? `${(Number(params.amount) / Number(params.members)).toFixed(2)} ${params.currency}`
								: `${(Number(params.amount) / Number(365)).toFixed(2)} ${params.currency}`}
						</Text>
						<Text variant="body3">
							{params.type === "rosca" ? "Monthly" : "Daily"}
						</Text>
					</YStack>
				</XStack>
				<Separator width="92%" />
				<XStack justify="space-between" width="92%" items="center">
					<XStack items="center" gap="$sm">
						<CalendarEvent size={32} color="$neutral2" />
						<Text>{params.type === "rosca" ? "End Date" : "Deadline"}</Text>
					</XStack>
					<Text>{params.endDate}</Text>
				</XStack>
				<Separator width="92%" />
				<Text color="$statusCritical">Unfortunately the group is full!</Text>
			</YStack>
			<Spacer />

			<Button
				variant="branded"
				size="lg"
				minW="85%"
				position="absolute"
				isDisabled={true}
				b="$4xl"
				onPress={() => {}}
			>
				{params.type === "rosca" ? "Join Chama" : "Join Group"}
			</Button>
		</Screen>
	);
}

import { Screen } from "@/components/layout/Screen";
import { Stack, Text, XStack } from "@/ui";
import { PapersText } from "@/ui/components/icons";

export default function SpaceNotifications() {
	return (
		<Screen title="Notifications">
			<XStack
				items="center"
				gap="$lg"
				rounded="$lg"
				bg="$surface2"
				width="92%"
				p="$sm"
				mt="$xl"
			>
				<Stack
					bg="$neutral3"
					height={48}
					rounded="$full"
					width={48}
					items="center"
					justify="center"
				>
					<PapersText size={30} color="$surface1" />
				</Stack>
				<Text variant="subHeading1" color="$neutral2">
					No notifications yet
				</Text>
			</XStack>
		</Screen>
	);
}

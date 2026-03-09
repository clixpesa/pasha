import { BackButton } from "@/components/Buttons/BackButton";
import {
	Button,
	IconButton,
	Input,
	Spacer,
	Stack,
	Text,
	TextInput,
	View,
	XStack,
	YStack,
} from "@/ui";
import { Gallery } from "@/ui/components/icons";
import { router } from "expo-router";
import { useState } from "react";
import { Button as Chip } from "tamagui";

export default function Create() {
	const [name, setName] = useState("");
	const [members, setMembers] = useState<string>("5");
	const [showButton, setShowButton] = useState<boolean>(true);

	const spaceNames = [
		"Holidays",
		"Savings",
		"Dream Chasers",
		"Superstars",
		"Education",
		"Tujiinue",
	];

	return (
		<View flex={1} bg="$surface1" items="center">
			<YStack gap="$md" width="100%">
				<XStack
					height={240}
					bg="$blueLight"
					width="100%"
					justify="space-between"
					items="flex-end"
					px="$2xl"
					py="$xl"
				>
					<Stack position="absolute" t="$lg" l="$lg">
						<BackButton onPressBack={() => router.navigate("/(tabs)/spaces")} />
					</Stack>
					<Text variant="subHeading1">Create a New Space</Text>
					<IconButton
						icon={<Gallery size={24} color="$neutral2" />}
						size="md"
						variant="branded"
						emphasis="secondary"
					/>
				</XStack>
				<TextInput
					placeholder="space name"
					width="92%"
					self="center"
					fontSize="$lg"
					autoFocus
					value={name}
					onFocus={() => setShowButton(false)}
					onBlur={() => setShowButton(true)}
					onChangeText={(text) => setName(text)}
				/>
				<XStack
					items="center"
					borderWidth={2}
					borderColor="$surface3"
					width="92%"
					justify="space-between"
					self="center"
					rounded="$md"
					px="$md"
					py="$xs"
				>
					<Text fontSize="$md" fontWeight="$md" color="$neutral2">
						No. of Participants:
					</Text>
					<Input
						height="$4xl"
						onFocus={() => setShowButton(false)}
						onBlur={() => setShowButton(true)}
						fontSize={26}
						width="30%"
						text="right"
						bg="$transparent"
						caretColor="$surface3"
						keyboardType="number-pad"
						placeholder="5"
						value={members}
						onChangeText={(text) => setMembers(text)}
					/>
				</XStack>
				<View
					flexDirection="row"
					flexWrap="wrap"
					gap="$xs"
					mt="$md"
					justify="center"
					self="center"
					width="92%"
				>
					{spaceNames.map((name) => (
						<Chip
							bg="$tealThemed"
							key={name}
							size="$sm"
							height="$3xl"
							onPress={() => setName(name)}
						>
							{name}
						</Chip>
					))}
				</View>
			</YStack>
			<Spacer />
			{showButton && (
				<Button
					variant="branded"
					size="lg"
					minW="85%"
					position="absolute"
					b="$4xl"
					onPress={() =>
						router.navigate({
							pathname: "/(spaces)/roscas/set-goal",
							params: {
								name,
								members,
							},
						})
					}
				>
					Continue
				</Button>
			)}
		</View>
	);
}

import { BackButton } from "@/components/Buttons/BackButton";
import {
	Button,
	IconButton,
	Separator,
	Spacer,
	Stack,
	Text,
	TextInput,
	TouchableArea,
	View,
	XStack,
	YStack,
} from "@/ui";
import { CheckCircle, CheckCircleFilled, Gallery } from "@/ui/components/icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button as Chip } from "tamagui";

export default function Create() {
	const params = useLocalSearchParams();
	const [name, setName] = useState("");
	const [showButton, setShowButton] = useState<boolean>(true);
	const [type, setType] = useState<string>(params.type as string);

	const spaceNames = [
		"Holidays",
		"Savings",
		"Gift",
		"Car",
		"Rainy day",
		"Education",
		"Renovation",
	];

	const spaceTypes = [
		{
			id: 1,
			type: "flex",
			label: "Easy Saver",
			desc: "Flexible",
		},
		{
			id: 2,
			type: "fixed",
			label: "Fixed Saver",
			desc: "Locked",
		},
		{
			id: 3,
			type: "challenge",
			label: "Weekly Challenge",
			desc: "Challenge",
		},
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
				<View
					flexDirection="row"
					flexWrap="wrap"
					gap="$xs"
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
				<Text self="flex-start" ml="$xl" variant="body3">
					Select Space Type
				</Text>
				<XStack gap="$vs" width="100%" justify="center">
					{spaceTypes.map((option) => (
						<PreferenceCard
							key={option.type}
							option={option}
							isSelected={type === option.type}
							onSelect={() => setType(option.type)}
						/>
					))}
				</XStack>
			</YStack>
			<Spacer />
			{showButton && (
				<Button
					variant="branded"
					size="lg"
					minW="85%"
					position="absolute"
					isDisabled={!name || !type}
					b="$4xl"
					onPress={() =>
						router.navigate({
							pathname: "/(spaces)/savings/customize",
							params: {
								name,
								amount: 0,
								type,
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

const PreferenceCard = ({
	option,
	isSelected,
	onSelect,
}: {
	option: { type: string; label: string; desc: string };
	isSelected: boolean;
	onSelect: () => void;
}) => {
	const label = option.label.split(" ");
	return (
		<TouchableArea
			width={120}
			p="$sm"
			gap="$xs"
			rounded="$md"
			borderWidth={isSelected ? 2 : 1}
			borderColor={isSelected ? "$accent1" : "$surface3"}
			onPress={onSelect}
		>
			<XStack justify="space-between" items="center">
				<YStack>
					<Text variant="body3" color={isSelected ? "$accent1" : "$neutral1"}>
						{label[0]}
					</Text>
					<Text variant="body3" color={isSelected ? "$accent1" : "$neutral1"}>
						{label[1]}
					</Text>
				</YStack>
				{isSelected ? (
					<CheckCircleFilled
						size={24}
						color="$tealBase"
						style={{ marginLeft: 8, marginTop: 4 }}
					/>
				) : (
					<CheckCircle size={22} color="$neutral3" />
				)}
			</XStack>
			<Separator borderWidth={1} width="90%" />
			<Stack items="center">
				<Text color={isSelected ? "$accent1" : "$neutral1"}>{option.desc}</Text>
				{/*<Text variant="body4" color={isSelected ? "$accent1" : "$neutral1"}>
					USD Weekly
				</Text>*/}
			</Stack>
		</TouchableArea>
	);
};

import { AccountIcon } from "@/components/account/AccountIcon";
import { Screen } from "@/components/layout/Screen";
import {
	closeGoalSavings,
	editGoalSavings,
} from "@/features/contracts/goal-savings";
import { getChainInfo, useWalletContext } from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import {
	Button,
	Input,
	ScrollView,
	Spacer,
	Text,
	TextInput,
	TouchableArea,
	XStack,
	YStack,
} from "@/ui";
import {
	CalendarEvent,
	Edit,
	Logout,
	MessageText,
	SendAction,
} from "@/ui/components/icons";
import {
	DateTimePickerAndroid,
	type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { openURL } from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function SavingsSettings() {
	const params = useLocalSearchParams();
	const { defaultChainId } = useEnabledChains();
	const chain = getChainInfo(defaultChainId);
	const [edit, setEdit] = useState<boolean>(false);
	const [name, setName] = useState<string>(params.name as string);
	const [goal, setGoal] = useState<string>(params.goal as string);
	const [date, setDate] = useState<Date>(new Date(Number(params.deadline)));
	const [showButtons, setShowButtons] = useState<boolean>(true);
	const { updateCurrentChainId, mainAccount } = useWalletContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const onChange = (
		event: DateTimePickerEvent,
		selectedDate: Date | undefined,
	) => {
		const currentDate = selectedDate || date;
		setDate(currentDate);
	};
	const showDatePicker = () => {
		//inputRef.current?.blur();
		DateTimePickerAndroid.open({
			value: date || new Date(), // Fallback to current date if null
			onChange,
			mode: "date",
			is24Hour: true,
			minimumDate: new Date(),
		});
	};
	const onCancel = () => {
		setDate(new Date(Number(params.deadline)));
		setName(params.name as string);
		setGoal(params.goal as string);
	};
	const onPressSave = async () => {
		setIsSaving(true);
		if (mainAccount && goal) {
			const reciept = await editGoalSavings({
				account: mainAccount,
				chainId: defaultChainId,
				name: name,
				targetAmount: goal,
				targetDate: date.valueOf(),
				key: params.spaceId as string,
			});
			//console.log(reciept);
			setIsSaving(false);
		}
	};

	const onCloseSpace = async () => {
		setIsLoading(true);
		if (mainAccount) {
			const reciept = await closeGoalSavings({
				account: mainAccount,
				chainId: defaultChainId,
				spaceId: params.spaceId as string,
			});
			//console.log(reciept);
			router.navigate("/(tabs)/spaces");
			setIsLoading(false);
		}
	};

	useEffect(() => {
		updateCurrentChainId(defaultChainId);
	}, [defaultChainId, updateCurrentChainId]);

	return (
		<Screen>
			<ScrollView showsVerticalScrollIndicator={false} width="100%">
				<YStack mx="$sm" my="$lg" gap="$sm">
					<XStack justify="space-between" items="center" mx="$xl">
						<TouchableArea onPress={() => {}}>
							<AccountIcon
								address={
									chain.contracts?.goalSavings.address
										? chain.contracts?.goalSavings.address
										: "0x765de816845861e75a25fca122bb6898b8b1282a"
								}
								size={60}
								showBorder={true}
								borderColor="$tealVibrant"
							/>
						</TouchableArea>
						<YStack gap="$xs" items="flex-end">
							<XStack gap="$sm">
								<TouchableArea
									borderWidth={2}
									borderColor="$surface3Hovered"
									rounded="$md"
									onPress={() => setEdit(!edit)}
								>
									<Edit size={24} m="$xs" color="$neutral2" />
								</TouchableArea>
								<TouchableArea
									borderWidth={2}
									borderColor="$surface3Hovered"
									rounded="$2xl"
									onPress={() => {
										Alert.alert(
											"Keep Calm!",
											"Sharing spaces with your friends is coming soon.",
										);
									}}
								>
									<XStack items="center" m="$xs" gap="$xs">
										<SendAction size={24} color="$neutral2" />
										<Text variant="buttonLabel2" mr="$2xs" color="$neutral2">
											Share
										</Text>
									</XStack>
								</TouchableArea>
							</XStack>
							<Text color="$neutral2" text="right" variant="body3">
								{params.spaceId}
							</Text>
						</YStack>
					</XStack>
					{edit ? null : (
						<YStack gap="$2xs" mx="$xl">
							<Text variant="subHeading1">{name}</Text>
						</YStack>
					)}
					<YStack gap="$2xs" mt="$xl">
						{edit ? (
							<XStack justify="space-between" items="center">
								<TextInput
									width="100%"
									placeholder={name}
									value={name}
									onFocus={() => setShowButtons(false)}
									onBlur={() => setShowButtons(true)}
									onChangeText={(text) => setName(text)}
								/>
							</XStack>
						) : null}
						<XStack
							items="center"
							bg="$surface1"
							justify="space-between"
							rounded="$md"
							px="$md"
							py="$xs"
							borderWidth={2}
							borderColor={edit ? "$surface3" : "$surface1"}
						>
							<Text variant="subHeading2">Goal:</Text>
							<XStack items="center" gap="$2xs" width="50%" justify="flex-end">
								<Input
									height="$4xl"
									fontSize={26}
									text="right"
									onFocus={() => setShowButtons(false)}
									onBlur={() => setShowButtons(true)}
									bg="$transparent"
									caretColor="$surface3"
									keyboardType="number-pad"
									placeholder={goal}
									disabled={!edit}
									value={goal}
									onChangeText={(text) => setGoal(text)}
								/>
								<Text variant="subHeading2" mt="$vs">
									USD
								</Text>
							</XStack>
						</XStack>
						<XStack
							justify="space-between"
							items="center"
							bg="$surface1"
							py="$sm"
							px="$md"
							rounded="$lg"
							borderWidth={2}
							borderColor={edit ? "$surface3" : "$surface1"}
						>
							<Text variant="subHeading2">Deadline: </Text>
							<TouchableArea disabled={!edit} onPress={showDatePicker}>
								<XStack gap="$xs" items="center">
									<Text color={edit ? "$accent1" : "$neutral1"}>
										{date.toLocaleDateString("en-US", {
											weekday: "short",
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</Text>
									<CalendarEvent
										size={28}
										color={edit ? "$accent1" : "$neutral1"}
									/>
								</XStack>
							</TouchableArea>
						</XStack>
						{edit || isSaving ? (
							<XStack gap="$md" self="center" mt="$xl">
								<Button
									variant="branded"
									emphasis="secondary"
									width="30%"
									onPress={() => {
										onCancel();
									}}
								>
									Cancel
								</Button>
								<Button
									variant="branded"
									width="30%"
									loading={isSaving}
									onPress={() => {
										setEdit(!edit);
										onPressSave();
									}}
								>
									{isSaving ? "Saving..." : "Save"}
								</Button>
							</XStack>
						) : null}
					</YStack>
				</YStack>
			</ScrollView>
			<Spacer />
			{showButtons && (
				<YStack position="absolute" b="$3xl" width="95%" gap="$xs">
					<TouchableArea onPress={() => openURL("https://wa.me/+254728682258")}>
						<XStack
							bg="$surface1"
							py="$sm"
							px="$md"
							rounded="$lg"
							gap="$md"
							items="center"
						>
							<MessageText size={20} color="$neutral2" />
							<Text>Report an issue</Text>
						</XStack>
					</TouchableArea>
					<TouchableArea onPress={() => onCloseSpace()}>
						<XStack
							bg="$surface1"
							py="$sm"
							px="$md"
							rounded="$lg"
							gap="$md"
							items="center"
						>
							<Logout size={24} color="$statusCritical" />
							<Text color="$statusCritical">
								{isLoading ? "Closing your space..." : "Close Space"}
							</Text>
						</XStack>
					</TouchableArea>
				</YStack>
			)}
		</Screen>
	);
}

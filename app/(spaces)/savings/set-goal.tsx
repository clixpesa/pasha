import { Screen } from "@/components/layout/Screen";
import { TokenLogo } from "@/components/logos/TokenLogo";
import {
	getRate,
	getTokensByChainId,
	useGetRateQuery,
} from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	Input,
	Separator,
	Spacer,
	Text,
	TouchableArea,
	XStack,
	YStack,
} from "@/ui";
import {
	ArrowUpDown,
	CalendarEvent,
	CheckmarkCircle,
	RotatableChevron,
} from "@/ui/components/icons";
import { fonts } from "@/ui/theme/fonts";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";

export default function SetGoal() {
	const params = useLocalSearchParams();
	const currency = useWalletState((s) => s.currency);
	const { symbol } = getRate(currency);
	const { data, isSuccess } = useGetRateQuery(currency);
	const conversionRate = data?.selling_rate;
	const inputRef = useRef<Input>(null);
	const { defaultChainId } = useEnabledChains();
	const tokens = getTokensByChainId(defaultChainId);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [amount, setAmount] = useState<string>();
	const [useCurrency, setUseCurrency] = useState<boolean>(true);
	const [tokenInfo, setTokenInfo] = useState(tokens[0]);
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
	const [date, setDate] = useState<Date>(new Date(Date.now() + 7776000000));

	const onOpenModal = useCallback(() => {
		inputRef.current?.blur();
		bottomSheetModalRef.current?.present();
	}, []);
	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				style={[props.style]}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.4}
			/>
		),
		[],
	);

	const onChange = (selectedDate) => {
		const currentDate = selectedDate || date;
		setDate(currentDate);
	};
	const showDatePicker = () => {
		inputRef.current?.blur();
		DateTimePickerAndroid.open({
			value: date || new Date(), // Fallback to current date if null
			onChange,
			mode: "date",
			is24Hour: true,
			minimumDate: new Date(),
		});
	};

	const onPressCreate = async () => {
		inputRef.current?.blur();
		if (isSending) router.navigate("/(tabs)/spaces");
		setIsTxLoading(true);
		setTimeout(() => {
			setIsTxLoading(false);
			setIsSending(true);
			onOpenModal();
		}, 2000);
	};

	return (
		<Screen title="Set your goal">
			<YStack gap="$xs" width="92%" mt="$5xl" items="center">
				<XStack items="center">
					{useCurrency ? (
						<Text
							fontSize={fonts.heading2.fontSize - 10}
							fontWeight="800"
							lineHeight={52}
						>
							{symbol}
						</Text>
					) : null}
					<Input
						ref={inputRef}
						fontSize={fonts.heading2.fontSize}
						fontWeight="800"
						autoFocus
						cursorColor="$surface3"
						maxW="75%"
						keyboardType="number-pad"
						placeholder="0"
						bg="$surface1"
						color="$neutral1"
						height={60}
						onPress={() => inputRef.current?.focus()}
						value={amount}
						onChangeText={(text) => setAmount(text)}
					/>
					{useCurrency ? null : (
						<Text
							fontSize={fonts.heading2.fontSize - 10}
							fontWeight="800"
							lineHeight={52}
						>
							{tokenInfo.symbol}
						</Text>
					)}
				</XStack>
				<TouchableArea onPress={() => setUseCurrency(!useCurrency)}>
					{useCurrency ? (
						<XStack gap="$2xs" items="center">
							<Text variant="subHeading1">
								{amount
									? tokenInfo.symbol.includes("SH") ||
										tokenInfo.symbol.includes("KES")
										? amount
										: (Number(amount) / conversionRate).toFixed(3)
									: "0.00"}{" "}
								{tokenInfo.symbol}
							</Text>
							<ArrowUpDown size={20} color="$neutral1" />
						</XStack>
					) : (
						<XStack gap="$2xs" items="center">
							<Text variant="subHeading1">
								~{symbol}{" "}
								{amount
									? tokenInfo.symbol.includes("SH")
										? amount
										: (Number(amount) * conversionRate).toFixed(2)
									: "0.00"}
							</Text>
							<ArrowUpDown size={20} color="$neutral1" />
						</XStack>
					)}
				</TouchableArea>
				<TouchableArea
					p="$xs"
					pr="$sm"
					bg="$surface3"
					rounded="$full"
					mt="$lg"
					onPress={() => {
						setIsSending(false);
						onOpenModal();
					}}
				>
					<XStack items="center" gap="$sm">
						<TokenLogo
							chainId={tokenInfo.chainId}
							symbol={tokenInfo.symbol}
							url={tokenInfo.logo}
							size={32}
						/>
						<Text variant="subHeading2">{tokenInfo.symbol}</Text>
						<RotatableChevron direction="down" color="$neutral1" ml={-10} />
					</XStack>
				</TouchableArea>
				<XStack items="center" my="$md" px="$4xl">
					<Separator borderWidth={1} />
					<Text variant="body2" mx="$sm">
						by
					</Text>
					<Separator borderWidth={1} />
				</XStack>
				<TouchableArea onPress={showDatePicker}>
					<XStack
						items="center"
						justify="center"
						gap="$2xl"
						width="85%"
						borderWidth={1}
						borderColor="$neutral3"
						rounded="$xl"
						py="$sm"
						px="$2xl"
					>
						<Text variant="subHeading2">
							{date.toLocaleDateString("en-US", {
								weekday: "short",
								day: "numeric",
								month: "short",
								year: "numeric",
							})}
						</Text>
						<CalendarEvent size={32} color="$tealBase" />
					</XStack>
				</TouchableArea>
			</YStack>
			<Spacer />
			<Button
				variant="branded"
				size="lg"
				b="$3xl"
				position="absolute"
				loading={isTxLoading}
				width="85%"
				isDisabled={!amount && !date}
				onPress={onPressCreate}
			>
				{isSending ? "Done" : "Create"}
			</Button>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["50%"]}
				backdropComponent={renderBackdrop}
				onDismiss={() => inputRef.current?.focus()}
				enableContentPanningGesture={!isSending}
				handleIndicatorStyle={isSending ? { backgroundColor: "#ffffff" } : null}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					{isSending ? (
						<YStack items="center" gap="$sm" width="100%" mt="$3xl">
							<CheckmarkCircle
								color="$statusSuccess"
								size={80}
								strokeWidth={1.5}
							/>
							<Text>Your space for</Text>
							<Text variant="subHeading1">{params.name}</Text>
							<Text>has been created successfully!</Text>
							<Spacer flex={1} />
							<Button
								size="lg"
								variant="branded"
								emphasis="tertiary"
								width="85%"
								onPress={() => {}}
							>
								View ticket
							</Button>

							<Button
								size="lg"
								variant="branded"
								width="85%"
								onPress={() =>
									router.navigate({
										pathname: "/(spaces)/savings/[spaceId]",
										params: {
											spaceId: 1,
										},
									})
								}
							>
								Done
							</Button>
						</YStack>
					) : (
						<Text>Token List</Text>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</Screen>
	);
}

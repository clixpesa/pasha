import { Screen } from "@/components/layout/Screen";
import { createGoalSavings } from "@/features/contracts/goal-savings";
import {
	DURATION_OPTIONS,
	DurationCard,
	getMonthlyDates,
	getWeeklyDates,
} from "@/features/spaces";
import {
	getRate,
	getTokensByChainId,
	useGetRateQuery,
	useWalletContext,
} from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	Input,
	ScrollView,
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
} from "@/ui/components/icons";
import { fonts } from "@/ui/theme/fonts";
import { formatMonthYear } from "@/utilities/format/date";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
	DateTimePickerAndroid,
	type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Customize() {
	const params = useLocalSearchParams();
	const initialAmount =
		Number(params.amount) > 0 ? params.amount.toString() : "";
	const currency = useWalletState((s) => s.currency);
	const { symbol } = getRate(currency);
	const { data, isSuccess } = useGetRateQuery(currency);
	const conversionRate = data?.selling_rate;

	const inputRef = useRef<Input>(null);
	const { defaultChainId } = useEnabledChains();
	const tokens = getTokensByChainId(defaultChainId);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [amount, setAmount] = useState<string>(initialAmount);
	const [useCurrency, setUseCurrency] = useState<boolean>(false);
	const [tokenInfo, setTokenInfo] = useState(tokens[0]);
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
	const [name, setName] = useState<string>(params.name as string);
	const [date, setDate] = useState<Date>(new Date(Date.now() + 7776000000));
	const [durationDates, setDurationDates] = useState<{
		startDate: Date;
		payoutDate: Date;
		endDate: Date;
		durationMonths: number;
	}>();
	console.log(Math.floor(durationDates?.payoutDate / 1000));
	const { updateCurrentChainId, mainAccount, isLoading } = useWalletContext();
	const [showButton, setShowButton] = useState<boolean>(true);
	const [duration, setDuration] = useState({
		name: "monthly",
		length: 12,
	});

	const [txReciept, setTxReciept] = useState<{
		txHash: string;
		spaceId: string | undefined;
	}>();

	const actualAmount = amount
		? useCurrency && tokenInfo.symbol.includes("USD")
			? (Number(amount) / conversionRate).toFixed(6)
			: amount
		: "0.00";

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

	const onChange = (
		event: DateTimePickerEvent,
		selectedDate: Date | undefined,
	) => {
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
		if (params.type === "challenge") {
			router.navigate({
				pathname: "/(spaces)/savings/wkc-overview",
				params: {
					name,
					amount: actualAmount,
					type: params.type,
					duration: duration.length,
					startDate: durationDates?.startDate.valueOf(),
					endDate: durationDates?.endDate.valueOf(),
					payoutDate: durationDates?.payoutDate.valueOf(),
				},
			});
		} else {
			setIsTxLoading(true);
			if (mainAccount && amount) {
				const reciept = await createGoalSavings({
					account: mainAccount,
					chainId: defaultChainId,
					name: name,
					targetAmount: actualAmount,
					targetDate: date.valueOf(),
				});
				setTxReciept({
					txHash: reciept.txHash,
					spaceId: reciept.spaceId,
				});
				setIsSending(true);
				setIsTxLoading(false);
				onOpenModal();
			}
		}
	};

	useEffect(() => {
		if (duration.name === "monthly") {
			const dDates = getMonthlyDates(duration.length);
			setDurationDates(dDates);
			setDate(dDates.endDate);
		} else if (duration.name === "weekly") {
			const dDates = getWeeklyDates(duration.length);
			setDurationDates(dDates);
			setDate(dDates.endDate);
		}
	}, [duration]);

	useEffect(() => {
		updateCurrentChainId(defaultChainId);
	}, [defaultChainId, updateCurrentChainId]);

	useEffect(() => {
		if (params.type === "fixed") {
			setDuration({
				name: "monthly",
				length: 12,
			});
		} else if (params.type === "challenge") {
			setDuration({
				name: "weekly",
				length: 36,
			});
		}
	}, []);

	return (
		<Screen title={Number(params.amount) > 0 ? "Customize" : "Add a goal"}>
			<Input
				height="$4xl"
				fontSize={24}
				width="75%"
				value={name}
				self="center"
				text="center"
				onChangeText={(text) => setName(text)}
				autoCorrect={false}
			/>
			<YStack gap="$xs" width="92%" items="center">
				<Separator borderWidth={1} px="$4xl" width="78%" />

				<XStack items="center" mt="$xl">
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
						bg="$transparent"
						autoFocus
						cursorColor="$surface3"
						maxW="75%"
						keyboardType="number-pad"
						placeholder="0"
						color="$neutral1"
						height={60}
						onFocus={() => setShowButton(false)}
						onBlur={() => setShowButton(true)}
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
							USD {/*tokenInfo.symbol*/}
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
								USD {/*tokenInfo.symbol*/}
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
				{/*<TouchableArea
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
				</TouchableArea>*/}
				<XStack items="center" my="$md" px="$4xl">
					{params.type === "flex" ? <Separator borderWidth={1} /> : null}
					<Text variant="body2" mx="$sm">
						{params.type === "flex" ? "by" : "Choose Duration"}
					</Text>
					<Separator borderWidth={1} />
				</XStack>
				{params.type === "flex" ? (
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
				) : (
					<YStack gap="$sm" maxH={200} width="100%">
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<XStack gap="$vs">
								{DURATION_OPTIONS[duration.name].map(
									(durationOption: { label: string; length: number }) => (
										<DurationCard
											key={durationOption.length}
											duration={durationOption}
											rate={
												params.type !== "challenge"
													? (
															Number(actualAmount) / durationOption.length
														).toFixed(2)
													: undefined
											}
											isSelected={durationOption.length === duration.length}
											onSelect={() => {
												setDuration({
													...duration,
													length: durationOption.length,
												});
											}}
										/>
									),
								)}
							</XStack>
						</ScrollView>
						{durationDates ? (
							<XStack
								justify="space-evenly"
								borderWidth={1}
								//borderBottomWidth={2}
								borderColor="$accent1"
								p="$sm"
								rounded="$md"
							>
								<YStack items="center" gap="$2xs">
									<Text variant="body4">Starts on</Text>
									<Text variant="body3" fontWeight="600">
										{formatMonthYear(durationDates?.startDate)}
									</Text>
								</YStack>
								<Separator borderWidth={1} width="90%" vertical />
								<YStack items="center" gap="$2xs">
									<Text variant="body4">Payout Date</Text>
									<Text variant="body3" fontWeight="600">
										{formatMonthYear(durationDates?.payoutDate)}
									</Text>
								</YStack>
								<Separator borderWidth={1} width="90%" vertical />
								<YStack items="center" gap="$2xs">
									<Text variant="body4">Total Payout </Text>
									<Text variant="body3" fontWeight="600">
										{(Number(actualAmount) * 1).toFixed(2)} USD
									</Text>
								</YStack>
							</XStack>
						) : null}
					</YStack>
				)}
			</YStack>
			<Spacer />
			{showButton && (
				<Button
					variant="branded"
					size="lg"
					b="$3xl"
					position="absolute"
					loading={isTxLoading}
					width="85%"
					isDisabled={!amount || (amount < 0 && !date)}
					onPress={onPressCreate}
				>
					{isSending
						? "Done"
						: params.type === "challenge"
							? "Continue"
							: "Create"}
				</Button>
			)}
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
						<YStack items="center" gap="$sm" width="100%" my="$3xl">
							<CheckmarkCircle
								color="$statusSuccess"
								size={80}
								strokeWidth={1.5}
							/>
							<Text>Your space for</Text>
							<Text variant="subHeading1">{name}</Text>
							<Text>has been created successfully!</Text>
							<Spacer flex={1} />
							<Button
								size="lg"
								variant="branded"
								emphasis="tertiary"
								width="85%"
								onPress={() =>
									openBrowserAsync(
										`${mainAccount?.chain?.blockExplorers?.default.url}/tx/${txReciept?.txHash}`,
									)
								}
							>
								View ticket
							</Button>

							<Button
								size="lg"
								variant="branded"
								width="85%"
								isDisabled={!txReciept?.spaceId}
								onPress={() =>
									router.navigate({
										pathname: "/(spaces)/savings/[spaceId]",
										params: {
											name,
											spaceId: txReciept?.spaceId,
											targetAmount: Number(actualAmount),
											targetDate: date.valueOf(),
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

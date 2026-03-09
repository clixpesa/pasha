import { Screen } from "@/components/layout/Screen";
import { TokenItem } from "@/components/lists/TokenItem";
import { TokenLogo } from "@/components/logos/TokenLogo";
import { createRosca, frequencyOptions } from "@/features/contracts/roscas";
import {
	type TokenWithBalance,
	getRate,
	useWalletContext,
} from "@/features/wallet";
import { useEnabledChains, useEnabledTokens } from "@/features/wallet/hooks";
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
	Check,
	CheckmarkCircle,
	RotatableChevron,
	Search,
	X,
} from "@/ui/components/icons";
import { fonts } from "@/ui/theme/fonts";
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
import { useCallback, useRef, useState } from "react";

export default function SetGoal() {
	const params = useLocalSearchParams();
	const currency = useWalletState((s) => s.currency);
	const { symbol, conversionRate } = getRate(currency);
	const inputRef = useRef<Input>(null);
	const { defaultChainId } = useEnabledChains();
	//const tokens = getTokensByChainId(defaultChainId);
	const allTokens = useEnabledTokens();
	const tokens = allTokens.filter((token) => token.chainId === defaultChainId);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [amount, setAmount] = useState<string>();
	const [useCurrency, setUseCurrency] = useState<boolean>(true);
	const [tokenInfo, setTokenInfo] = useState(tokens[0]);
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isSelect, setIsSelect] = useState<boolean>(false);
	const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
	const [frequency, setFrequency] = useState<{
		name: string;
		interval: number;
	}>({
		name: "Monthly",
		interval: 2419200,
	});
	const [txReciept, setTxReciept] = useState<{
		txHash: string;
		spaceId: string | undefined;
	}>();

	const [date, setDate] = useState<Date>(
		new Date(Date.now() + frequency.interval * 1000),
	);
	const [showButton, setShowButton] = useState<boolean>(true);
	const { updateCurrentChainId, mainAccount, isLoading } = useWalletContext();

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
		setIsTxLoading(true);

		if (mainAccount && amount) {
			const reciept = await createRosca({
				account: mainAccount,
				name: params.name as string,
				tokenId: `${tokenInfo.symbol}_${tokenInfo.chainId}`,
				payoutAmount: actualAmount,
				interval: frequency.interval,
				memberCount: Number(params.members),
				startDate: Number((date.valueOf() / 1000).toFixed(0)),
			});
			//console.log(reciept);
			setTxReciept({
				txHash: reciept.txHash,
				spaceId: reciept.spaceId,
			});
			setIsSending(true);
			setIsTxLoading(false);
			onOpenModal();
		}
	};
	return (
		<Screen title="Set your goal">
			<YStack gap="$xs" width="92%" mt="$3xl" items="center">
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
						bg="$transparent"
						color="$neutral1"
						onFocus={() => setShowButton(false)}
						onBlur={() => setShowButton(true)}
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
				<YStack gap="$xs" width="100%">
					<XStack items="center" mt="$md" px="$lg">
						<Text variant="body1" mr="$sm">
							Pay
						</Text>
						<Separator borderWidth={1} />
					</XStack>
					<XStack items="center" px="$lg" justify="space-between">
						<Text variant="body1">
							{symbol}{" "}
							<Text variant="body1" fontWeight="$md">
								{(
									(useCurrency
										? Number(amount) | 0
										: (Number(amount) * conversionRate) | 0) /
									Number(params.members)
								).toFixed(2)}
							</Text>{" "}
							every:
						</Text>
						<TouchableArea
							onPress={() => {
								setIsSelect(true);
								onOpenModal();
							}}
						>
							<XStack gap="$2xs">
								<Text variant="body1" fontWeight="$md" color="$accent1">
									{frequency.name.endsWith("ly")
										? frequency.name.slice(0, -2)
										: frequency.name}
								</Text>
								<RotatableChevron direction="down" />
							</XStack>
						</TouchableArea>
					</XStack>
				</YStack>
				<XStack items="center" my="$md" px="$lg">
					<Separator borderWidth={1} />
					<Text variant="body1" mx="$sm">
						1st payout on
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
			{showButton && (
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
					{isSending ? "Done" : isTxLoading ? "Creating" : "Create"}
				</Button>
			)}
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["50%"]}
				backdropComponent={renderBackdrop}
				onDismiss={() => {
					setIsSelect(false);
				}}
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
							<Text variant="subHeading1">{params.name}</Text>
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
								onPress={() =>
									router.navigate({
										pathname: "/(spaces)/roscas/[spaceId]",
										params: {
											spaceId: txReciept?.spaceId,
											admin: mainAccount?.account?.address,
											name: params.name,
											payoutAmount: actualAmount,
											startDate: date.valueOf() / 1000,
											memberCount: params.members,
											interval: frequency.interval,
										},
									})
								}
							>
								Done
							</Button>
						</YStack>
					) : isSelect ? (
						<YStack mt="$md" items="center" width="92%" gap="$sm">
							<Text>Set payment frequency</Text>
							{frequencyOptions.map((item) => (
								<TouchableArea
									key={item.frequency}
									width="92%"
									onPress={() => {
										setFrequency({
											name: item.frequency,
											interval: item.interval,
										});
										bottomSheetModalRef.current?.close();
									}}
								>
									<XStack
										items="center"
										width="100%"
										justify="space-between"
										p="$2xs"
										borderBottomWidth={1}
										borderBottomColor="$surface3"
									>
										<YStack>
											<Text variant="subHeading2">{item.frequency}</Text>
											<Text color="$neutral2" variant="body3">
												{item.desc}
											</Text>
										</YStack>
										{item.frequency === frequency.name ? (
											<Check color="$accent1" size={24} />
										) : null}
									</XStack>
								</TouchableArea>
							))}
						</YStack>
					) : (
						<TokenList
							tokens={tokens}
							onPress={(token) => {
								bottomSheetModalRef.current?.close();
								setTokenInfo(token);
							}}
						/>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</Screen>
	);
}

const TokenList = ({
	tokens,
	onPress,
}: {
	tokens: TokenWithBalance[];
	onPress: (item: TokenWithBalance) => void;
}) => {
	const inputRef = useRef<Input>(null);
	const [searchText, setSearchText] = useState("");
	return (
		<YStack gap="$sm" mt="$xl" width="92%">
			<XStack
				borderWidth={2}
				borderColor="$surface3"
				rounded="$vl"
				items="center"
				px="$sm"
				gap="$vs"
				mb="$sm"
			>
				<Search size={24} color="$neutral2" />
				<Input
					ref={inputRef}
					fontSize="$lg"
					autoCapitalize="none"
					autoCorrect={false}
					px={1}
					placeholder="search token"
					height="$5xl"
					value={searchText}
					textContentType="none"
					//text={searchText.length > 23 ? "right" : "left"}
					maxW="81%"
					multiline={false}
					grow={1}
					onChangeText={(text) => setSearchText(text)}
				/>
				{searchText.length > 3 ? (
					<TouchableArea onPress={() => setSearchText("")} hitSlop={10}>
						<X size={24} color="$neutral2" />
					</TouchableArea>
				) : null}
			</XStack>
			<YStack
				bg="$surface1"
				width="100%"
				pt="$md"
				pb="$xl"
				rounded="$lg"
				gap="$lg"
			>
				{tokens.map((item) => {
					const tokenId = `${item.symbol}_${item.chainId}`;
					return (
						<TouchableArea key={tokenId} onPress={() => onPress(item)}>
							<TokenItem
								tokenInfo={{
									name: item.name,
									symbol: item.symbol,
									logoUrl: item.logo,
									chainId: item.chainId,
								}}
								amount={{
									actual: item.balance,
									inUSD: item.balanceUSD,
								}}
							/>
						</TouchableArea>
					);
				})}
			</YStack>
		</YStack>
	);
};

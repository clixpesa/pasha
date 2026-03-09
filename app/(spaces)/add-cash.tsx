import { HeaderBackButton } from "@/components/Buttons/HeaderNavButtons";
import { AccountIcon } from "@/components/account/AccountIcon";
import { AccountIconWChainLogo } from "@/components/account/AccountIconWChainLogo";

import { TokenItem } from "@/components/lists/TokenItem";
import { TokenLogo } from "@/components/logos/TokenLogo";
import { depositSavings } from "@/features/contracts/goal-savings";
import { fundRoscaSlot } from "@/features/contracts/roscas";
import { useSpacesState } from "@/features/spaces/spacesState";
import {
	type Balance,
	type ChainId,
	type TokenWithBalance,
	getChainInfo,
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
	Stack,
	Text,
	TouchableArea,
	UniversalImage,
	View,
	XStack,
	YStack,
} from "@/ui";
import {
	AlertCircle,
	ArrowDown,
	ArrowUpDown,
	CheckmarkCircle,
	RotatableChevron,
	Search,
	X,
} from "@/ui/components/icons";
import { fonts } from "@/ui/theme/fonts";
import { shortenAddress } from "@/utilities/addresses";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import type { Address } from "viem";

export default function FundSpaceScreen() {
	const params = useLocalSearchParams();
	const currency = useWalletState((s) => s.currency);
	const overdraft = useWalletState((s) => s.overdraft);
	const setSpaceTx = useSpacesState((s) => s.setSpaceTxs);
	const { symbol, conversionRate } = getRate(currency);
	const { defaultChainId } = useEnabledChains();
	const inputRef = useRef<Input>(null);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [amount, setAmount] = useState<string>();
	const [useCurrency, setUseCurrency] = useState<boolean>(true);
	const [isOverdraft, setIsOverdraft] = useState<boolean>(false);
	const [isReview, setIsReview] = useState<boolean>(true);
	const [isTxLoading, setIsTxLoading] = useState<boolean>(true);
	const [isSending, setIsSending] = useState<boolean>(false);
	const { updateCurrentChainId, mainAccount, isLoading } = useWalletContext();
	const [txHash, setTxHash] = useState<string>();

	let filter = "USD";
	if (params.token) filter = params.token.includes("USD") ? "USD" : "KES";

	const allTokens = useEnabledTokens();
	const tokens = allTokens.filter(
		(token) =>
			token.symbol.includes(filter) && token.chainId === defaultChainId,
	);
	const [tokenInfo, setTokenInfo] = useState(tokens[0]);
	const chain = getChainInfo(tokenInfo.chainId);

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

	/*useEffect(() => {
		if (
			Number(actualAmount) > tokenInfo.balance &&
			tokenInfo.chainId === (ChainId.Alfajores || ChainId.Celo)
		) {
			setIsOverdraft(true);
		} else {
			setIsOverdraft(false);
		}
	}, [actualAmount, tokenInfo]);*/

	const onConfirmSend = async () => {
		bottomSheetModalRef.current?.snapToPosition(
			Dimensions.get("screen").height,
		);
		setIsSending(true);
		setIsTxLoading(true);
		if (!isOverdraft && mainAccount && amount) {
			if (params.origin === "rosca") {
				const txHash = await fundRoscaSlot({
					account: mainAccount,
					spaceId: params.id as string,
					token: tokenInfo,
					amount: actualAmount,
					isDefaulted: false,
				});
				console.log(txHash, params.id);
				setTxHash(txHash);
				setSpaceTx(params.id as string, txHash);
			} else {
				const txHash = await depositSavings({
					account: mainAccount,
					spaceId: params.id as string,
					token: tokenInfo,
					amount: actualAmount,
				});
				console.log(txHash, params.id);
				setTxHash(txHash);
				setSpaceTx(params.id as string, txHash);
			}
			setIsTxLoading(false);
		}
	};

	useEffect(() => {
		updateCurrentChainId(tokenInfo.chainId);
	}, [tokenInfo, updateCurrentChainId]);

	return (
		<View flex={1} items="center" bg="$surface1">
			<Header
				address={params.address as Address}
				name={params.name as string}
			/>
			<YStack gap="$xs" width="92%" mt="$5xl" items="center">
				<XStack items="center">
					{useCurrency ? (
						<Text
							fontSize={fonts.heading2.fontSize}
							fontWeight="800"
							lineHeight={52}
						>
							{symbol}
						</Text>
					) : null}
					<Input
						ref={inputRef}
						fontSize={fonts.heading2.fontSize + 10}
						fontWeight="800"
						autoFocus
						bg="$transparent"
						cursorColor="$surface3"
						maxW="75%"
						keyboardType="number-pad"
						placeholder="0"
						color={
							isOverdraft
								? "$blueBase"
								: Number(actualAmount) > tokenInfo.balance
									? "$statusCritical"
									: "$neutral1"
						}
						height={60}
						onPress={() => inputRef.current?.focus()}
						value={amount}
						onChangeText={(text) => setAmount(text)}
					/>
					{useCurrency ? null : (
						<Text
							fontSize={fonts.heading2.fontSize}
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
						setIsReview(false);
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
						<Text variant="subHeading2">
							{tokenInfo.symbol} -{" "}
							{useCurrency
								? `${symbol}${(tokenInfo.balanceUSD * conversionRate).toFixed(2)}`
								: tokenInfo.balance.toFixed(3)}
						</Text>
						<RotatableChevron direction="down" color="$neutral1" ml={-10} />
					</XStack>
				</TouchableArea>
				{/*tokenInfo.chainId === (ChainId.Alfajores || ChainId.Celo) ? (
					<Text color={isOverdraft ? "$blueBase" : "$neutral1"}>
						Jazisha: Ksh{overdraft.balance.toFixed(2)}
					</Text>
				) : null*/}
			</YStack>
			<Spacer />
			<Button
				variant="branded"
				size="lg"
				b="$3xl"
				position="absolute"
				width="85%"
				isDisabled={
					!amount || (!isOverdraft && Number(actualAmount) > tokenInfo.balance)
				}
				onPress={() => {
					setIsReview(true);
					onOpenModal();
				}}
			>
				Review
			</Button>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={
					isReview ? (isSending ? ["100%"] : ["55%"]) : ["50%", "90%"]
				}
				backdropComponent={renderBackdrop}
				onDismiss={() => inputRef.current?.focus()}
				enableContentPanningGesture={!isSending}
				handleIndicatorStyle={isSending ? { backgroundColor: "#ffffff" } : null}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					{isReview ? (
						isSending ? (
							<SendContent
								tokenInfo={tokenInfo}
								amount={
									amount
										? useCurrency && tokenInfo.symbol.includes("USD")
											? Number(amount) / conversionRate
											: Number(amount)
										: 0
								}
								currency={{
									symbol: symbol,
									rate: conversionRate,
								}}
								recipient={params}
								isLoading={isTxLoading}
								onPressDone={() => router.back()}
								onViewReciept={() =>
									openBrowserAsync(
										`${chain.blockExplorers?.default.url}/tx/${txHash}`,
									)
								}
							/>
						) : (
							<ReviewContent
								tokenInfo={tokenInfo}
								amount={
									amount
										? useCurrency && tokenInfo.symbol.includes("USD")
											? Number(amount) / conversionRate
											: Number(amount)
										: 0
								}
								currency={{
									symbol: symbol,
									rate: conversionRate,
								}}
								recipient={params}
								overdraft={overdraft}
								isOverdraft={isOverdraft}
								isLoading={isLoading}
								onConfirmSend={onConfirmSend}
							/>
						)
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
		</View>
	);
}

type HeaderParams = {
	address: Address;
	name: string;
	id?: string | number;
};

const Header = ({ address, name }: HeaderParams) => {
	return (
		<XStack width="100%" py="$xs" px="$sm" justify="space-between" mt="$xs">
			<XStack gap="$sm">
				<HeaderBackButton />
				<Text
					variant="subHeading1"
					fontWeight="$md"
					color="$neutral1"
					mt="$3xs"
				>
					Fund
				</Text>
			</XStack>
			<XStack gap="$sm" items="center">
				<YStack gap="$2xs">
					<Text
						variant="subHeading1"
						fontWeight="$md"
						color="$neutral1"
						text="right"
						mt="$3xs"
					>
						{name}
					</Text>
					<Text color="$neutral2" text="right">
						{name.startsWith("0x")
							? "External account"
							: shortenAddress(address, 5)}
					</Text>
				</YStack>
				<TouchableArea rounded="$full" pr="$sm" mt="$3xs">
					<AccountIcon
						size={42}
						address={address}
						showBorder={true}
						borderColor="$tealPastel"
					/>
				</TouchableArea>
			</XStack>
		</XStack>
	);
};

type ReviewContentType = {
	tokenInfo: TokenWithBalance;
	recipient: { name: string; address: Address };
	amount: number;
	currency: {
		symbol: string;
		rate: number;
	};
	isOverdraft: boolean;
	overdraft: Balance;
	isLoading: boolean;
	onConfirmSend: () => void;
};

const ReviewContent = ({
	tokenInfo,
	amount,
	currency,
	isOverdraft,
	overdraft,
	recipient,
	isLoading,
	onConfirmSend,
}: ReviewContentType) => {
	const deficit = tokenInfo.symbol.includes("USD")
		? (amount - tokenInfo.balanceUSD) * currency.rate
		: amount - tokenInfo.balance;

	const isOverdraftLimit = tokenInfo.symbol.includes("USD")
		? tokenInfo.balanceUSD + overdraft.balanceUSD - amount < 0
		: tokenInfo.balance + overdraft.balance - amount < 0;

	return (
		<YStack gap="$md" mt="$lg" mb="$3xl" width="85%">
			<YStack gap="$md" mt="$lg">
				<Text>You're sending {isOverdraft ? "with Jazisha" : null}</Text>
				<XStack width="100%" justify="space-between" items="center" pr="$2xs">
					<YStack>
						<Text
							variant="heading3"
							color={
								isOverdraft
									? isOverdraftLimit
										? "$statusCritical"
										: "$blueVibrant"
									: "$neutral1"
							}
						>
							{amount.toFixed(3)} {tokenInfo.symbol}
						</Text>
						<Text
							color={
								isOverdraft
									? isOverdraftLimit
										? "$statusCritical"
										: "$blueBase"
									: "$neutral2"
							}
						>
							{currency.symbol}{" "}
							{tokenInfo.symbol.includes("USD")
								? (Number(amount) * currency.rate).toFixed(2)
								: amount.toFixed(2)}
						</Text>
					</YStack>
					<TokenLogo
						chainId={tokenInfo.chainId}
						symbol={tokenInfo.symbol}
						url={tokenInfo.logo}
						size={42}
					/>
				</XStack>
				<ArrowDown size={30} color="$neutral2" />
				<XStack width="100%" justify="space-between" items="center" pr="$2xs">
					<YStack gap="$2xs">
						<Text variant="subHeading1">{recipient.name}</Text>
						<Text color="$neutral2">
							{recipient.name.startsWith("0x")
								? "External Address"
								: shortenAddress(recipient.address, 5)}
						</Text>
					</YStack>
					<AccountIconWChainLogo
						size={46}
						address={recipient.address}
						chainId={tokenInfo.chainId}
					/>
				</XStack>
				<Separator />
				{isOverdraftLimit ? (
					<XStack items="center" justify="center" gap="$sm">
						<AlertCircle color="$statusCritical" size={20} />
						<Text color="$statusCritical" text="right">
							Jazisha Limit Exceeded!
						</Text>
					</XStack>
				) : (
					<YStack gap="$xs">
						{isOverdraft ? (
							<XStack justify="space-between">
								<Text color="$blueVibrant">Jazisha:</Text>
								<Text variant="subHeading2" color="$blueVibrant">
									Ksh {deficit.toFixed(2)}
								</Text>
							</XStack>
						) : null}
						<XStack justify="space-between">
							<Text>Fee:</Text>
							<XStack gap="$xs">
								<Text
									variant="subHeading2"
									textDecorationLine="line-through"
									color="$orangeBase"
								>
									Ksh 12.00
								</Text>
								<Text variant="subHeading2">0.00</Text>
							</XStack>
						</XStack>
					</YStack>
				)}
			</YStack>
			<Button
				size="lg"
				variant="branded"
				/*bg="$blueBase"
				pressStyle={{
					bg: "$blueVibrant",
				}}*/
				mt="$3xl"
				isDisabled={isOverdraftLimit}
				loading={isLoading}
				onPress={onConfirmSend}
			>
				Confirm send
			</Button>
		</YStack>
	);
};

const TokenList = ({
	tokens,
	onPress,
}: {
	tokens: TokenWithBalance[];
	onPress: (item: TokenWithBalance) => void;
}) => {
	const inputRef = useRef<Input>(null);
	const [searchText, setSearchText] = useState("");
	const tokensWithBal = tokens.filter((token) => token.balance > 0);
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
				{!tokensWithBal.length ? (
					<TouchableArea key={1} onPress={() => onPress(tokens[0])}>
						<TokenItem
							tokenInfo={{
								name: tokens[0].name,
								symbol: tokens[0].symbol,
								logoUrl: tokens[0].logo,
								chainId: tokens[0].chainId,
							}}
							amount={{
								actual: tokens[0].balance,
								inUSD: tokens[0].balanceUSD,
							}}
						/>
					</TouchableArea>
				) : (
					tokensWithBal.map((item) => {
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
					})
				)}
			</YStack>
		</YStack>
	);
};

type SendContentType = {
	tokenInfo: { chainId: ChainId; symbol: string; logo: string };
	recipient: { name: string; address: Address };
	amount: number;
	currency: {
		symbol: string;
		rate: number;
	};
	isLoading: boolean;
	onPressDone: () => void;
	onViewReciept: () => void;
};

const SendContent = ({
	tokenInfo,
	amount,
	currency,
	recipient,
	isLoading,
	onPressDone,
	onViewReciept,
}: SendContentType) => {
	return (
		<Stack flex={1} justify="center" items="center" width="100%" minH="100%">
			<YStack gap="$md" width="85%" mb="$5xl">
				{isLoading ? (
					<Stack self="center" mr="$xl">
						<UniversalImage
							uri={require("@/ui/assets/gifs/send.gif")}
							size={{ height: 80, width: 80 }}
						/>
					</Stack>
				) : (
					<YStack gap="$md">
						<CheckmarkCircle color="$statusSuccess" size={80} self="center" />
						<Text text="center">Your transfer was successfull!</Text>
					</YStack>
				)}
				<Text text="center" variant="subHeading1">
					{isLoading ? "You're sending..." : "You sent"}
				</Text>
				<XStack width="100%" justify="space-between" items="center" pr="$2xs">
					<YStack>
						<Text variant="heading3" color={"$neutral1"}>
							{amount.toFixed(3)} {tokenInfo.symbol}
						</Text>
						<Text color={"$neutral2"}>
							{currency.symbol}{" "}
							{tokenInfo.symbol.includes("USD")
								? (Number(amount) * currency.rate).toFixed(2)
								: amount.toFixed(2)}
						</Text>
					</YStack>
					<TokenLogo
						chainId={tokenInfo.chainId}
						symbol={tokenInfo.symbol}
						url={tokenInfo.logo}
						size={42}
					/>
				</XStack>
				{isLoading ? (
					<Stack self="center">
						<UniversalImage
							uri={require("@/ui/assets/gifs/arrow-down.gif")}
							size={{ height: 30, width: 30 }}
						/>
					</Stack>
				) : (
					<ArrowDown size={30} color="$neutral2" self="center" />
				)}
				<XStack width="100%" justify="space-between" items="center" pr="$2xs">
					<YStack gap="$2xs">
						<Text variant="subHeading1">{recipient.name}</Text>
						<Text color="$neutral2">
							{recipient.name.startsWith("0x")
								? "External Address"
								: shortenAddress(recipient.address, 5)}
						</Text>
					</YStack>
					<AccountIconWChainLogo
						size={46}
						address={recipient.address}
						chainId={tokenInfo.chainId}
					/>
				</XStack>
				{isLoading ? null : (
					<YStack gap="$md">
						<Separator />
						<YStack gap="$xs">
							<XStack justify="space-between">
								<Text>Fee:</Text>
								<XStack gap="$xs">
									<Text
										variant="subHeading2"
										textDecorationLine="line-through"
										color="$orangeBase"
									>
										Ksh 12.00
									</Text>
									<Text variant="subHeading2">0.00</Text>
								</XStack>
							</XStack>
						</YStack>
					</YStack>
				)}
			</YStack>
			<YStack b="$3xl" gap="$md" position="absolute" width="85%">
				{!isLoading && (
					<Button
						size="lg"
						variant="branded"
						emphasis="tertiary"
						width="100%"
						onPress={onViewReciept}
					>
						View reciept
					</Button>
				)}
				<Button
					size="lg"
					variant="branded"
					loading={isLoading}
					width="100%"
					onPress={onPressDone}
				>
					{isLoading ? "Sending..." : "Done"}
				</Button>
			</YStack>
		</Stack>
	);
};

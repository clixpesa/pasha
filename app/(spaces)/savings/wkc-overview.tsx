import { Screen } from "@/components/layout/Screen";
import { getRate, useGetRateQuery, useMainAccount } from "@/features/wallet";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	Separator,
	Spacer,
	Stack,
	Text,
	TouchableArea,
	XStack,
	YStack,
} from "@/ui";
import {
	CalendarEvent,
	CheckCircle,
	CheckCircleFilled,
	CheckmarkCircle,
} from "@/ui/components/icons";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useCallback, useEffect, useRef, useState } from "react";

export default function WKCOverview() {
	const params = useLocalSearchParams();
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const currency = useWalletState((s) => s.currency);
	const { symbol } = getRate(currency);
	const { data, isSuccess } = useGetRateQuery(currency);
	const conversionRate = data?.selling_rate;
	const mainAccount = useMainAccount();
	const [txReciept, setTxReciept] = useState<{
		txHash: string;
		spaceId: string | undefined;
	}>();
	const [amount, setAmount] = useState({
		even: 0,
		base: 0,
		high: 0,
	});

	const breakdown = getWeeklyBreakdown(
		amount.base,
		params.duration ? Number(params.duration) : 48,
	);

	//console.log(breakdown);
	const preferenceOptions = {
		LOW: {
			label: "Low to High",
			rate: `+${amount.base.toFixed(2)}`,
			amount: amount.base,
		},
		EVEN: {
			label: "Stay Even",
			rate: `${amount.even.toFixed(2)}`,
			amount: amount.even,
		},
		HIGH: {
			label: "High to Low",
			rate: `-${amount.base.toFixed(2)}`,
			amount: amount.high,
		},
	};

	const [preference, setPreference] = useState({
		key: "LOW",
		...preferenceOptions["LOW"],
	});

	const onPressCreate = () => {
		// Navigate to the challenge created screen
		// For now, just simulate a loading state
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			bottomSheetModalRef.current?.present();
			//navigation.navigate("/(spaces)/savings/wkc-created");
		}, 2000);
	};

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

	useEffect(() => {
		const durationWeeks = params.duration ? Number(params.duration) : 48;
		const baseAmount = calculateBaseAmount(
			Number(params.amount),
			durationWeeks,
		);
		setAmount({
			even: Number(params.amount) / durationWeeks,
			base: baseAmount,
			high: baseAmount * durationWeeks,
		});
		setPreference({
			key: "LOW",
			...preferenceOptions["LOW"],
			amount: baseAmount,
		});
	}, []);
	return (
		<Screen title="Challenge Overview">
			<YStack gap="$md" width="92%" mt="$xl" items="center">
				<YStack
					width="100%"
					gap="$md"
					bg="$surface3"
					py="$md"
					px="$sm"
					rounded="$md"
				>
					<YStack items="center" gap="$2xs">
						<Text>Target</Text>
						<Stack items="center">
							<Text variant="heading3" fontWeight={900}>
								{Number(params.amount).toFixed(2)} USD
							</Text>
							<Text variant="body3">
								{`≈ ${symbol} ${(Number(params.amount) * conversionRate).toFixed(2)}`}
							</Text>
						</Stack>
					</YStack>
					<XStack justify="space-between" mx="$sm">
						<Text variant="body3">Preference</Text>
						<Text
							variant="body4"
							px="$sm"
							pt="$3xs"
							bg="$accent1"
							rounded="$sm"
							fontWeight={800}
							color="$surface1"
						>
							{preference.label}
						</Text>
					</XStack>
					<XStack
						justify="space-between"
						items="center"
						bg="$surface1"
						p="$sm"
						rounded="$md"
					>
						<CalendarEvent size={28} color="$tealBase" />
						<YStack gap="$2xs">
							<Text variant="body4" fontWeight={800}>
								1st Installment
							</Text>
							<Text variant="body4">Sun, 30th Jun 2026</Text>
						</YStack>
						<YStack items="flex-end" mr="$xs">
							<Text>{preference.amount.toFixed(2)} USD</Text>
							<Text variant="body4" color="$neutral2">
								{`≈ ${symbol}${(Number(preference.amount) * conversionRate).toFixed(2)}`}
							</Text>
						</YStack>
					</XStack>
				</YStack>
				<Text self="flex-start" ml="$md">
					Set a preference
				</Text>
				<XStack gap="$sm" width="100%" justify="center">
					{Object.entries(preferenceOptions).map(([key, option]) => (
						<PreferenceCard
							key={key}
							option={{ ...option, key }}
							isSelected={preference.key === key}
							onSelect={() => setPreference({ key, ...option })}
						/>
					))}
				</XStack>
				<YStack
					width="100%"
					bg="$surface3"
					rounded="$md"
					p="$sm"
					gap="$xs"
					maxH={300}
				>
					<XStack justify="space-between" mb="$2xs">
						<Text fontWeight={600} variant="body3">
							Week
						</Text>
						<Text fontWeight={600} variant="body3">
							Installment
						</Text>
						<Text fontWeight={600} variant="body3">
							Total Saved
						</Text>
					</XStack>
					<Separator borderWidth={1} />
					{preference.key !== "HIGH"
						? breakdown.slice(0, 3).map((amt, index) => (
								<XStack key={index} justify="space-between">
									<Text width={100}>Week 0{index + 1}</Text>
									<Text width={100}>
										{preference.key === "EVEN"
											? amount.even.toFixed(2)
											: amt.toFixed(2)}
										<Text variant="body4"> USD</Text>
									</Text>
									<Text width={130} text="right">
										{preference.key === "EVEN"
											? (amount.even * (index + 1)).toFixed(2)
											: calculateTotalSavings(amount.base, index + 1).toFixed(
													2,
												)}
										<Text variant="body4"> USD</Text>
									</Text>
								</XStack>
							))
						: breakdown
								.slice(Number(params.duration) - 3, Number(params.duration))
								.reverse()
								.map((amt, index) => (
									<XStack key={index} justify="space-between">
										<Text width={100}>Week 0{index + 1}</Text>
										<Text width={100}>
											{amt.toFixed(2)}
											<Text variant="body4"> USD</Text>
										</Text>
										<Text width={130} text="right">
											{calculateTotalSavingsDescending(
												amount.high,
												amount.base,
												index + 1,
											).toFixed(2)}
											<Text variant="body4"> USD</Text>
										</Text>
									</XStack>
								))}
					<XStack justify="space-between">
						<Text>...</Text>
						<Text>...</Text>
						<Text>...</Text>
					</XStack>
					<XStack justify="space-between">
						<Text width={100}>Week {params?.duration}</Text>
						<Text width={100} text="left">
							{preference.key === "EVEN"
								? preference.amount.toFixed(2)
								: preference.key === "HIGH"
									? amount.base.toFixed(2)
									: breakdown[Number(params?.duration) - 1].toFixed(2)}
							<Text variant="body4"> USD</Text>
						</Text>
						<Text width={130} text="right">
							{calculateTotalSavings(
								amount.base,
								Number(params.duration),
							).toFixed(2)}
							<Text variant="body4"> USD</Text>
						</Text>
					</XStack>
				</YStack>
			</YStack>
			<Spacer />
			<Button
				variant="branded"
				size="lg"
				b="$3xl"
				position="absolute"
				loading={isLoading}
				width="85%"
				onPress={onPressCreate}
			>
				Create Challenge
			</Button>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["50%"]}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
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
							isDisabled={!txReciept?.spaceId}
							onPress={() =>
								router.navigate({
									pathname: "/(spaces)/savings/[spaceId]",
									params: {
										name: params.name,
										spaceId: txReciept?.spaceId,
										targetAmount: Number(params.amount),
										targetDate: Number(params.endDate),
									},
								})
							}
						>
							Done
						</Button>
					</YStack>
				</BottomSheetView>
			</BottomSheetModal>
		</Screen>
	);
}

const PreferenceCard = ({
	option,
	isSelected,
	onSelect,
}: {
	option: { key: string; rate: string; label: string };
	isSelected: boolean;
	onSelect: () => void;
}) => (
	<TouchableArea
		width={115}
		p="$sm"
		gap="$xs"
		rounded="$md"
		borderWidth={isSelected ? 2 : 1}
		borderColor={isSelected ? "$accent1" : "$surface3"}
		onPress={onSelect}
	>
		<XStack justify="space-between" items="center">
			<YStack>
				<Text variant="body4" color={isSelected ? "$accent1" : "$neutral1"}>
					{option.key === "EVEN" ? "Stay" : "Start"}
				</Text>
				<Text color={isSelected ? "$accent1" : "$neutral1"} fontWeight={300}>
					{option.key}
				</Text>
			</YStack>
			{isSelected ? (
				<CheckCircleFilled
					size={24}
					color="$tealBase"
					style={{ marginLeft: 8, marginTop: 4 }}
				/>
			) : (
				<CheckCircle size={24} color="$neutral3" />
			)}
		</XStack>
		<Separator borderWidth={1} width="90%" />
		<Stack items="center">
			<Text color={isSelected ? "$accent1" : "$neutral1"}>{option.rate}</Text>
			<Text variant="body4" color={isSelected ? "$accent1" : "$neutral1"}>
				USD Weekly
			</Text>
		</Stack>
	</TouchableArea>
);

function calculateBaseAmount(targetAmount: number, weeks = 48): number {
	// Calculate the sum of weeks: 1 + 2 + 3 + ... + n = n × (n + 1) / 2
	const sumOfWeeks = (weeks * (weeks + 1)) / 2;
	const baseAmount = targetAmount / sumOfWeeks;
	return baseAmount;
}

/**
 * Returns the amount to be saved for a specific week.
 *
 * @param baseAmount - The amount to save in week 1
 * @param week - The week number
 * @returns The amount to save in that week
 */
function getWeeklySavings(baseAmount: number, week: number): number {
	return baseAmount * week;
}

/**
 * Generates a breakdown of weekly savings for the entire challenge.
 *
 * @param baseAmount - The amount to save in week 1
 * @param weeks - Number of weeks (default: 48)
 * @returns Array of weekly savings amounts
 */
function getWeeklyBreakdown(baseAmount: number, weeks = 48): number[] {
	const breakdown: number[] = [];
	for (let week = 1; week <= weeks; week++) {
		breakdown.push(getWeeklySavings(baseAmount, week));
	}
	return breakdown;
}

function calculateTotalSavings(baseAmount: number, weeks = 48): number {
	const sumOfWeeks = (weeks * (weeks + 1)) / 2;
	return baseAmount * sumOfWeeks;
}

function calculateTotalSavingsDescending(
	initialAmount: number,
	baseAmount: number,
	weeks = 48,
): number {
	// Sum of all reductions: 0 + 1 + 2 + ... + (n-1) = n × (n - 1) / 2
	const sumOfReductions = (weeks * (weeks - 1)) / 2;

	// Total = (initialAmount × weeks) - (baseAmount × sumOfReductions)
	const total = initialAmount * weeks - baseAmount * sumOfReductions;

	return total;
}

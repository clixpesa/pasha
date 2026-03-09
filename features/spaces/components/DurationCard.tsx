import { Separator, Stack, Text, TouchableArea, XStack, YStack } from "@/ui";
import { CheckCircle, CheckCircleFilled } from "@/ui/components/icons";
import { fonts } from "@/ui/theme/fonts";

export type DurationCardProps = {
	rate?: string;
	duration: {
		label: string;
		length: number;
	};
	isSelected: boolean;
	onSelect: () => void;
};

export const DURATION_OPTIONS = {
	weekly: [
		{ length: 48, label: "weeks" },
		{ length: 36, label: "weeks" },
		{ length: 24, label: "weeks" },
		{ length: 16, label: "weeks" },
	],
	monthly: [
		{ length: 6, label: "months" },
		{ length: 12, label: "months" },
		{ length: 18, label: "months" },
		{ length: 24, label: "months" },
	],
};

/**
 * Calculate start date, payout date, and end date for a recurring deposit plan
 * @param {number} durationMonths - Number of months (6, 12, 18 or 24)
 * @param {Date} createdDate - The date when the plan is created (optional, defaults to today)
 * @returns {Object} { startDate, payoutDate, endDate }
 */
export const getMonthlyDates = (
	durationMonths: number,
	createdDate = new Date(),
) => {
	// Determine the start month
	const createdDay = createdDate.getDate();
	const createdMonth = createdDate.getMonth();
	const createdYear = createdDate.getFullYear();

	let startMonth = createdMonth;
	let startYear = createdYear;

	// If created between 1-24th, deposits start this month (25th onwards)
	// If created between 25th-31st, deposits start next month
	if (createdDay >= 25) {
		startMonth += 1;
		if (startMonth > 11) {
			startMonth = 0;
			startYear += 1;
		}
	}

	// Start date is the 25th of the determined start month
	const startDate = new Date(startYear, startMonth, 25);

	// Payout date is 28th of the month after duration ends
	let payoutMonth = startMonth + durationMonths;
	let payoutYear = startYear;

	while (payoutMonth > 11) {
		payoutMonth -= 12;
		payoutYear += 1;
	}

	const payoutDate = new Date(payoutYear, payoutMonth, 28);

	// End date is the 5th of the last month (one month after start + duration)
	let endMonth = startMonth + durationMonths;
	let endYear = startYear;

	while (endMonth > 11) {
		endMonth -= 12;
		endYear += 1;
	}

	// End date is 5th of the final month
	const endDate = new Date(endYear, endMonth, 5);

	return {
		startDate,
		payoutDate,
		endDate,
		durationMonths,
	};
};

/**
 * Calculate start date, payout date, and end date for a weekly recurring deposit plan
 * @param {number} durationWeeks - Number of weeks (e.g., 4, 8, 12, etc.)
 * @param {Date} createdDate - The date when the plan is created (optional, defaults to today)
 * @returns {Object} { startDate, endDate, payoutDate, durationWeeks }
 */
export const getWeeklyDates = (
	durationWeeks: number,
	createdDate = new Date(),
) => {
	// Start date is the same day the plan is created
	const startDate = new Date(createdDate);

	// Find the Sunday of the current week (end date for deposits of week 1)
	const dayOfWeek = createdDate.getDay();
	const daysUntilSunday = (7 - dayOfWeek) % 7 || 7; // If today is Sunday, next Sunday is 7 days away
	const firstWeekEndDate = new Date(createdDate);
	firstWeekEndDate.setDate(firstWeekEndDate.getDate() + daysUntilSunday);

	// Calculate the final end date: (durationWeeks - 1) weeks after first week ends
	const endDate = new Date(firstWeekEndDate);
	endDate.setDate(endDate.getDate() + (durationWeeks - 1) * 7);

	// Payout date is Friday of the week of the end date
	// Find the Friday of the week containing endDate
	const dayOfWeekEnd = endDate.getDay();
	let daysUntilFriday: number;

	if (dayOfWeekEnd === 5) {
		// If endDate is already Friday, payout is the same day
		daysUntilFriday = 0;
	} else if (dayOfWeekEnd < 5) {
		// If it's Mon-Thu, Friday is ahead
		daysUntilFriday = 5 - dayOfWeekEnd;
	} else {
		// If it's Sat or Sun, Friday of next week
		daysUntilFriday = 12 - dayOfWeekEnd; // Goes to next Friday
	}

	const payoutDate = new Date(endDate);
	payoutDate.setDate(payoutDate.getDate() + daysUntilFriday);
	const durationMonths = durationWeeks / 4;

	return {
		startDate,
		endDate,
		payoutDate,
		durationMonths,
	};
};

export const DurationCard = ({
	rate,
	duration,
	isSelected,
	onSelect,
}: DurationCardProps) => (
	<TouchableArea
		gap="$xs"
		items="center"
		rounded="$md"
		borderWidth={isSelected ? 2 : 1}
		borderColor={isSelected ? "$accent1" : "$surface3"}
		p="$sm"
		onPress={onSelect}
		width={120}
		flex={0}
	>
		<XStack justify="space-between" items="center" width="100%">
			<YStack>
				<Text
					fontSize={fonts.subheading1.fontSize + 4}
					lineHeight={26}
					color={isSelected ? "$accent1" : "$neutral1"}
				>
					{duration.length}
				</Text>
				<Text variant="body4" color={isSelected ? "$accent1" : "$neutral1"}>
					{duration.label}
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
		{rate && (
			<>
				<Separator borderWidth={1} width="90%" />
				<Stack items="center">
					<Text variant="body2" color={isSelected ? "$accent1" : "$neutral1"}>
						{rate}
					</Text>
					<Text variant="body4" color={isSelected ? "$accent1" : "$neutral1"}>
						USD {duration.label.replace("s", "ly")}
					</Text>
				</Stack>
			</>
		)}
	</TouchableArea>
);

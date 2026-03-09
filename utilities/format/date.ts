/**
 * Format date as "MMM YYYY" (e.g., "Feb 2026")
 */
export function formatMonthYear(date: Date) {
	return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Format date as "MMM Dth YYYY" (e.g., "Feb 25th 2026")
 */
export function formatFullDate(date: Date) {
	const day = date.getDate();
	const suffix = getOrdinalSuffix(day);
	return date
		.toLocaleDateString("en-US", {
			month: "short",
			year: "numeric",
		})
		.replace(
			date.getFullYear().toString(),
			`${day}${suffix} ${date.getFullYear()}`,
		);
}

/**
 * Format date as "Day Dth MMM, YYYY" (e.g., "Wed Jan 15th, 2026")
 */
export function formatFullDateWithDay(date: Date) {
	const day = date.getDate();
	const suffix = getOrdinalSuffix(day);
	const formatted = date.toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
	});
	const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
	const [month, year] = formatted.split(" ");
	return `${dayName} ${month} ${day}${suffix}, ${year}`;
}

/**
 * Get ordinal suffix for day (st, nd, rd, th)
 */
export function getOrdinalSuffix(day: number) {
	if (day > 3 && day < 21) return "th";
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

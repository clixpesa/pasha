import type { JSX } from "react";
import { Stack, XStack, YStack, isWeb } from "tamagui";
import { Text } from "../text";
import { Skeleton } from "./Skeleton.native";

interface TxLoaderProps {
	opacity: number;
	withAmounts?: boolean;
}

export function TransactionLoader({
	opacity,
	withAmounts = false,
}: TxLoaderProps): JSX.Element {
	return (
		<XStack items="center" content="space-between" opacity={opacity} py="$sm">
			<XStack items="center" gap="$md" overflow="hidden">
				<Skeleton>
					<Stack bg="$neutral3" rounded="$full" height="$icon.md" width="$icon.md" />
				</Skeleton>

				<YStack items="flex-start">
					<Text
						loading="no-shimmer"
						loadingPlaceholderText="Transaction Name"
						numberOfLines={1}
						variant={isWeb ? "body3" : "body1"}
					/>
					<XStack items="center" gap="$sm" minH={20}>
						<Text
							loading="no-shimmer"
							loadingPlaceholderText="Wed, 1:30 PM"
							numberOfLines={1}
							variant={isWeb ? "body3" : "body2"}
						/>
					</XStack>
				</YStack>

				{withAmounts && (
					<YStack items="flex-end">
						<Text
							loading="no-shimmer"
							loadingPlaceholderText="$XX.XX"
							numberOfLines={1}
							variant="body1"
						/>
						<XStack items="center" gap="$sm" minH={20}>
							<Text
								loading="no-shimmer"
								loadingPlaceholderText="~XX.XX"
								numberOfLines={1}
								variant="subHeading2"
							/>
						</XStack>
					</YStack>
				)}
			</XStack>
		</XStack>
	);
}

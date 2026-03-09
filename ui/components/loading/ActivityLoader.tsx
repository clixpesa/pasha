import { Text } from "@/ui/components/text";
import type React from "react";
import { Stack, XStack } from "tamagui";

interface ActivityLoaderProps {
	opacity: number;
}

export const TXN_HISTORY_LOADER_ICON_SIZE = "$icon.lg";

export function ActivityLoader({
	opacity,
}: ActivityLoaderProps): React.JSX.Element {
	return (
		<Stack opacity={opacity} overflow="hidden" className="TransactionLoader">
			<XStack items="flex-start" gap="$lg" content="space-between" py="$md">
				<XStack items="center" gap="$md" height="100%" content="flex-start">
					<Stack
						items="center"
						content="center"
						bg="$surface2"
						rounded="$full"
						height={TXN_HISTORY_LOADER_ICON_SIZE}
						width={TXN_HISTORY_LOADER_ICON_SIZE}
					/>
					<Stack>
						<XStack items="center" gap="$xs">
							<Text
								loading
								loadingPlaceholderText="Contract Interaction"
								numberOfLines={1}
								variant="body1"
							/>
						</XStack>
						<Text
							loading
							color="$neutral2"
							loadingPlaceholderText="Caption Text"
							numberOfLines={1}
							variant="subHeading2"
						/>
					</Stack>
				</XStack>
			</XStack>
		</Stack>
	);
}

import { AccountIcon } from "@/components/account/AccountIcon";
import { Stack, Text, XStack, YStack, styled } from "@/ui";
import type { YStackProps } from "tamagui";
import { Card, Progress } from "tamagui";

export type SpaceItemProps = YStackProps & {
	rightLabel?: string;
	isActive?: boolean;
};

export const SpaceItem = ({
	children,
	rightLabel,
	...props
}: SpaceItemProps) => {
	return (
		<Card {...props} padded rounded="$md" bg="$surface3">
			<Card.Header gap="$md">
				<XStack gap="$sm" items="center">
					<Stack mt="$2xs">
						<AccountIcon
							size={42}
							address="0x765DE816845861e75A25fCA122bb6898B8B1282e"
						/>
					</Stack>
					<YStack gap="$2xs">
						<Text fontWeight="$md">{children}</Text>

						<XStack>
							<Text variant="body3">Ksh 100</Text>
							<Text variant="body3" color="$neutral3">
								{" "}
								/ {rightLabel}
							</Text>
						</XStack>
					</YStack>
				</XStack>

				<Progress value={60} height="$vs" bg="$tealThemed">
					<Progress.Indicator bg="$tealBase" animation="80ms-ease-in-out" />
				</Progress>
			</Card.Header>
		</Card>
	);
};

const SpaceItemFrame = styled(XStack, {
	bg: "$surface1",
	items: "center",
	justify: "center",
	p: "$sm",
	gap: "$md",

	variants: {
		isActive: {
			true: {
				bg: "$backgroundFocus",
			},
			false: {
				hoverStyle: {
					bg: "$backgroundHover",
				},
				pressStyle: {
					bg: "$backgroundPress",
				},
			},
		},
	} as const,
});

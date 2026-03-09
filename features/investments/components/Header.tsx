import { AccountIcon } from "@/components/account/AccountIcon";
import { useAppState } from "@/features/essentials/appState";
import { Text, TouchableArea, XStack } from "@/ui";
import { BarchartLine, Earth } from "@/ui/components/icons";

export const InvestHeader = () => {
	const user = useAppState((s) => s.user);
	return (
		<XStack
			width="100%"
			items="center"
			py="$xs"
			px="$sm"
			justify="space-between"
		>
			<XStack gap="$sm" items="center">
				<TouchableArea>
					<AccountIcon
						address={
							user.invtAddress
								? user.invtAddress
								: "0x765DE816845861e75A25fCA122bb6898B8123456"
						}
						size={40}
					/>
				</TouchableArea>
				<Text
					variant="subHeading1"
					fontWeight="$md"
					fontSize="$lg"
					color="$neutral1"
				>
					Invest
				</Text>
			</XStack>
			<XStack gap="$sm" px="$sm" items="center">
				<TouchableArea rounded="$full">
					<BarchartLine color="$neutral3" size={30} />
				</TouchableArea>
				<TouchableArea rounded="$full">
					<Earth color="$neutral3" size={32} />
				</TouchableArea>
			</XStack>
		</XStack>
	);
};

import { AccountIcon } from "@/components/account/AccountIcon";
import { useGetRateQuery } from "@/features/wallet";
import { useWalletState } from "@/features/wallet/walletState";
import { Text, TouchableArea, XStack } from "@/ui";
import { router } from "expo-router";
import { useAppState } from "../appState";

export  const HomeHeader = () => {
	const user = useAppState((s) => s.user);
	const currency = useWalletState((s) => s.currency);
	const { data, isLoading, isFetching } = useGetRateQuery(currency);
	return (
		<XStack
			width="100%"
			items="center"
			py="$xs"
			px="$sm"
			justify="space-between"
		>
			<XStack gap="$sm" items="center">
				<TouchableArea onPress={() => router.navigate("/(tabs)/account")}>
					<AccountIcon
						address={
							user.mainAddress
								? user.mainAddress
								: "0x765de816845861e75a25fca122bb6898b8b1282a"
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
					Pasha
				</Text>
			</XStack>
			<XStack gap="$sm" px="$sm" items="center">
				<Text color="$neutral2" variant="body3">
					1USD={isFetching || isLoading ? "..." : data?.selling_rate}
				</Text>
				{/*<TouchableArea rounded="$full">
					<ScanHome color="$neutral3" size={34} />
				</TouchableArea>
				<TouchableArea rounded="$full">
					<BarchartLine color="$neutral3" size={32} />
				</TouchableArea>*/}
			</XStack>
		</XStack>
	);
};

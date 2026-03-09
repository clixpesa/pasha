import { AccountIcon } from "@/components/account/AccountIcon";
import { Screen } from "@/components/layout/Screen";
import { useAppState } from "@/features/essentials/appState";
import {
	QRCodeDisplay,
	Stack,
	Text,
	TouchableArea,
	UniversalImage,
	XStack,
	YStack,
	useThemeColors,
} from "@/ui";
import { Buy, CopySheets, QrCode } from "@/ui/components/icons";
import { shortenAddress } from "@/utilities/addresses";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { getAuth, getIdTokenResult } from "@react-native-firebase/auth";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ReciveScreen() {
	const user = useAppState((s) => s.user);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const colors = useThemeColors();
	const address = user.mainAddress
		? user.mainAddress
		: "0x765DE816845861e75A25fCA122bb6898B8B1282a";
	const phone = user.phoneNumber || user.email;
	const [clixtag, setClixtag] = useState<string>();

	const copyToClipboard = async (text: string) => {
		await Clipboard.setStringAsync(text);
	};

	const onOpenModal = useCallback(() => {
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

	useEffect(() => {
		(async () => {
			const user = getAuth().currentUser;
			const clixtag = await getIdTokenResult(user, true).then(
				(tokenResults) => tokenResults.claims.tag,
			);
			setClixtag(clixtag);
		})();
	}, []);
	return (
		<Screen
			title="Receive"
			rightElement={{
				Icon: <Buy size={32} color="$neutral3" />,
				onPress: () => router.navigate("/(transactions)/ramps/deposit"),
			}}
		>
			<YStack gap="$md" mt="$lg" width="92%">
				<Text text="center" px="$2xl" variant="body2">
					Anyone with Clixpesa can send you cash using your phone number, tag or
					by scanning this QR code
				</Text>
				<QRCodeDisplay
					size={200}
					color={colors.accent1Hovered.val}
					encodedValue={phone}
				>
					<AccountIcon
						address={address}
						avatarUri={""}
						size={50}
						borderColor="$surface1"
						borderWidth="$2xs"
						showBackground={true}
						showBorder={true}
					/>
				</QRCodeDisplay>
				<TouchableArea items="center" onPress={() => copyToClipboard(phone)}>
					<Text variant="subHeading1">@{clixtag}</Text>
					<XStack items="center" gap="$2xs" mt="$2xs">
						<Text>{phone}</Text>
						<CopySheets size={20} color="$neutral2" />
					</XStack>
				</TouchableArea>
				<YStack
					bg="$surface1"
					width="100%"
					px="$sm"
					py="$md"
					rounded="$lg"
					mt="$lg"
					gap="$md"
				>
					<XStack items="center" justify="space-between">
						<XStack gap="$sm">
							<Stack
								bg="$surface3"
								height={42}
								rounded="$md"
								width={42}
								items="center"
								justify="center"
							>
								<UniversalImage
									size={{
										height: 32,
										width: 32,
									}}
									uri={require("@/ui/assets/images/network-logos/all-networks.png")}
								/>
							</Stack>
							<YStack gap="$2xs">
								<Text variant="subHeading2">EVM Chains</Text>
								<Text variant="body3" color="$neutral2">
									0x{shortenAddress(address, 5).toUpperCase().slice(2)}
								</Text>
							</YStack>
						</XStack>
						<XStack gap="$vs">
							<TouchableArea
								p="$sm"
								bg="$accent2"
								rounded="$full"
								onPress={() => copyToClipboard(address)}
							>
								<CopySheets size={22} color="$accent1" />
							</TouchableArea>
							<TouchableArea
								p="$sm"
								bg="$accent2"
								rounded="$full"
								onPress={onOpenModal}
							>
								<QrCode size={22} color="$accent1" />
							</TouchableArea>
						</XStack>
					</XStack>
				</YStack>
			</YStack>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["80%"]}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					<YStack gap="$md" mt="$lg" mb="$3xl" width="92%">
						<TouchableArea
							items="center"
							onPress={() => copyToClipboard(address)}
						>
							<Text variant="subHeading1">
								{clixtag}
								<Text variant="subHeading1" color="$neutral2">
									.clix.eth
								</Text>
							</Text>
							<XStack items="center" gap="$2xs" mt="$2xs">
								<Text>
									0x{shortenAddress(address, 5).toUpperCase().slice(2)}
								</Text>
								<CopySheets size={20} color="$neutral2" />
							</XStack>
						</TouchableArea>
						<QRCodeDisplay
							size={240}
							color={colors.accent1Hovered.val}
							encodedValue={address}
						>
							<AccountIcon
								address={address}
								avatarUri={""}
								size={60}
								borderColor="$surface1"
								borderWidth="$2xs"
								showBackground={true}
								showBorder={true}
							/>
						</QRCodeDisplay>
						<Text
							text="center"
							px="$2xl"
							variant="body3"
							color="$neutral2Hovered"
						>
							Use this address to recieve supported stablecoins on AVALANCHE,
							BASE, CELO and ETHEREUM
						</Text>
					</YStack>
				</BottomSheetView>
			</BottomSheetModal>
		</Screen>
	);
}

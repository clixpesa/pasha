import { AccountIcon } from "@/components/account/AccountIcon";
import { Screen } from "@/components/layout/Screen";
import { MethodId, type MethodInfo } from "@/features/wallet";
import { supportedProviders } from "@/features/wallet/transactions/supportedProviders";
import { useWalletState } from "@/features/wallet/walletState";
import { Separator, Text, TouchableArea, XStack, YStack } from "@/ui";
import {
	CheckCircle,
	CheckCircleFilled,
	RotatableChevron,
} from "@/ui/components/icons";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ProvidersScreen() {
	const onramp = useWalletState((s) => s.onramp);
	const setMethod = useWalletState((s) => s.setMethod);
	const setPreferredProvider = useWalletState((s) => s.setPrefferredProvider);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [methodInfo, setMethodInfo] = useState<MethodInfo>();

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
		const methodInfo = supportedProviders[onramp.method];
		setMethodInfo(methodInfo);
	}, [onramp]);

	/*useEffect(() => {
		const storeProviders = async () => {
			const proviers = await appStorage.getItem("RampsProviders");
			console.log("Stored Providers:", proviers);
		};
		storeProviders();
	}, []);*/

	return (
		<Screen title="Change payment method">
			<YStack width="90%" gap="$vs" mt="$xl">
				{/**
				 * Mobile Money, Bank Transfer, Card
				 */}
				<Text variant="subHeading1">Payment Method</Text>
				<TouchableArea onPress={() => bottomSheetModalRef.current?.present()}>
					<XStack
						justify="space-between"
						p="$md"
						py="$sm"
						bg="$surface3"
						rounded="$lg"
						items="center"
					>
						<XStack items="center" gap="$sm">
							<AccountIcon
								address="0x456a3D042C0DbD3db53D5489e98dFb038553B0d0"
								size={32}
								avatarUri={methodInfo?.logo}
							/>
							<Text variant="subHeading2" fontSize={18}>
								{methodInfo?.name}
							</Text>
						</XStack>
						<RotatableChevron direction="down" />
					</XStack>
				</TouchableArea>
			</YStack>
			<YStack width="90%" gap="$vs" mt="$xl">
				{/**
				 * Providers
				 * Mobile Money: MPESA, Airtel Money, TKash
				 * Bank Transfer: KCB, Equity, Stanbic - through Pesalink
				 * Card: Visa, Mastercard
				 */}
				<Text variant="subHeading1">Provider</Text>
				<Text color="$neutral2" variant="body3" mb="$sm">
					An STK Push will be sent to prompt you to authorise a transaction on
					your mobile money
				</Text>
				{methodInfo?.providers.map((provider) => (
					<TouchableArea
						key={provider.id}
						onPress={() => {
							if (onramp?.details?.[provider.id]) {
								setPreferredProvider(provider.id);
								return;
							}
							router.navigate({
								pathname: "/(transactions)/ramps/account-details",
								params: {
									providerId: provider.id,
									providerName: provider.name,
								},
							});
						}}
					>
						<XStack
							justify="space-between"
							p="$md"
							py="$vs"
							bg="$surface3"
							rounded="$lg"
							items="center"
						>
							<XStack items="center" gap="$sm">
								<AccountIcon
									address="0x456a3D042C0DbD3db53D5489e98dFb038553B0d0"
									size={36}
									avatarUri={provider.logo}
								/>
								<Text fontSize={18}>{provider.name}</Text>
							</XStack>
							<XStack items="center" gap="$xs">
								{onramp.details ? (
									<Text>{onramp?.details?.[provider.id]?.accountNumber}</Text>
								) : (
									<Text variant="body4">Add Account No.</Text>
								)}
								{onramp.provider === provider.id ? (
									<CheckCircleFilled color="$accent1" size={24} />
								) : onramp.details ? (
									<CheckCircle color="$surface3" size={24} />
								) : (
									<RotatableChevron direction="right" />
								)}
							</XStack>
						</XStack>
					</TouchableArea>
				))}
			</YStack>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["52%"]}
				backdropComponent={renderBackdrop}
				onDismiss={() => {}}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					<YStack gap="$sm" width="90%" mt="$xl" mb="$4xl">
						<YStack mb="$md">
							<Text variant="body3" text="center">
								External providers are used to process fiat to crypto purchases.
							</Text>
							<Text variant="body3" text="center" color="$neutral2">
								Rates vary between providers.
							</Text>
						</YStack>
						<TouchableArea
							onPress={() => {
								setMethod(MethodId.MobileMoney);
								bottomSheetModalRef.current?.close();
							}}
						>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<AccountIcon
										address="0x456a3D042C0DbD3db53D5489e98dFb038553B0d0"
										size={36}
										avatarUri={require("@/ui/assets/images/provider-logos/mobile-money.png")}
									/>

									<YStack width="80%" gap="$3xs">
										<XStack justify="space-between">
											<Text>Mobile Money</Text>
										</XStack>
										<Text variant="body4" color="$neutral2">
											Use MPESA, Airtel Money and more.
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
						<Separator />
						<TouchableArea
							onPress={() => {
								//setMethod(MethodId.BankTransfer);
								bottomSheetModalRef.current?.close();
							}}
						>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<AccountIcon
										address="0x456a3D042C0DbD3db53D5489e98dFb038553B0d0"
										size={38}
										avatarUri={require("@/ui/assets/images/provider-logos/bank-transfer.png")}
									/>

									<YStack width="80%" gap="$3xs">
										<XStack justify="space-between">
											<Text>Bank Transfer</Text>
											<Text color="$neutral2">Coming soon!</Text>
										</XStack>
										<Text variant="body4" color="$neutral2">
											Use Pesalink to transfer from your bank.
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
						<Separator />
						<TouchableArea
							onPress={() => {
								//setMethod(MethodId.CreditCard);
								bottomSheetModalRef.current?.close();
							}}
						>
							<XStack justify="space-between" items="center">
								<XStack items="center" gap="$sm">
									<AccountIcon
										address="0x456a3D042C0DbD3db53D5489e98dFb038553B0d0"
										size={36}
										avatarUri={require("@/ui/assets/images/provider-logos/credit-card.png")}
									/>
									<YStack width="80%" gap="$3xs">
										<XStack justify="space-between">
											<Text>Card</Text>
											<Text color="$neutral2">Coming soon!</Text>
										</XStack>
										<Text variant="body4" color="$neutral2">
											Use/Link your debit/credit card.
										</Text>
									</YStack>
								</XStack>
								<RotatableChevron direction="right" />
							</XStack>
						</TouchableArea>
					</YStack>
				</BottomSheetView>
			</BottomSheetModal>
		</Screen>
	);
}

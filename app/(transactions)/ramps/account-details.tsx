import { Screen } from "@/components/layout/Screen";
import { useAppState } from "@/features/essentials/appState";
import type { ProviderId } from "@/features/wallet";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Button,
	PhoneInput,
	Spacer,
	Text,
	TextInput,
	XStack,
	YStack,
} from "@/ui";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
export default function AddAccountDetails() {
	//TODO: prefill existing details if any
	//Validate account number based on provider if possible
	const params = useLocalSearchParams();
	const user = useAppState((s) => s.user);
	const setProvider = useWalletState((s) => s.setProvider);
	const accountName = user.name?.split(" ") || [];
	const [firstName, setFirstName] = useState(accountName[0] || "");
	const [lastName, setLastName] = useState(accountName[1] || "");
	const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
	const [isLoading, setIsLoading] = useState<boolean>();

	const onPressContinue = async () => {
		setIsLoading(true);
		setProvider(params.providerId as ProviderId, {
			accountName: `${firstName} ${lastName}`,
			accountNumber: phoneNumber,
			bankName: params.providerName as string,
		});
		//Save details to storage as well.
		setIsLoading(false);
		router.back();
	};

	useEffect(() => {
		const accountName = user.name?.split(" ") || [];
		setFirstName(accountName[0] || "");
		setLastName(accountName[1] || "");
		// Prefill account number if available
		if (user.phoneNumber) {
			setPhoneNumber(user.phoneNumber);
		}
	}, [user]);
	return (
		<Screen title="">
			<YStack width="94%" items="center" gap="$xl">
				<Text variant="subHeading1">Update your Account Details</Text>
				<YStack minW="95%" gap="$xs">
					<Text ml="$md" color="$neutral2">
						{params.providerName} account name
					</Text>
					<XStack gap="$sm" width="100%">
						<TextInput
							placeholder="Firstname"
							fontSize="$lg"
							width={"45%"}
							py="$md"
							autoFocus
							rounded="$vl"
							keyboardType="email-address"
							onChangeText={setFirstName}
							value={firstName}
						/>
						<TextInput
							placeholder="Lastname"
							fontSize="$lg"
							width={"45%"}
							py="$md"
							rounded="$vl"
							keyboardType="email-address"
							onChangeText={setLastName}
							value={lastName}
						/>
					</XStack>
				</YStack>
				<YStack minW="92%" gap="$xs">
					<Text ml="$md" color="$neutral2">
						{params.providerName} account number
					</Text>
					<PhoneInput onChangeText={setPhoneNumber} value={phoneNumber} />
				</YStack>
			</YStack>
			<Spacer />
			<Button
				variant="branded"
				isDisabled={!firstName || !lastName || !phoneNumber}
				loading={isLoading}
				onPress={onPressContinue}
				position="absolute"
				size="lg"
				b="$3xl"
				width="80%"
			>
				Continue
			</Button>
		</Screen>
	);
}

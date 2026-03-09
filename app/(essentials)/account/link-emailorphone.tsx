import { Screen } from "@/components/layout/Screen";
import {
	Button,
	PhoneInput,
	Spacer,
	Stack,
	Text,
	TextInput,
	XStack,
	YStack,
} from "@/ui";
import { getAuth, verifyPhoneNumber } from "@react-native-firebase/auth";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function LinkEmailPhone() {
	const params = useLocalSearchParams();
	const isEmail = params.link === "email";
	const [email, setEmail] = useState<string | undefined>();
	const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>();

	const onPressContinue = async () => {
		setIsLoading(true);
		if (isEmail) {
			if (email) {
				const instance = httpsCallable(getFunctions(), "sendEmailOTP");
				const response = await instance({ email, isSignIn: false });
				setIsLoading(false);
				router.navigate({
					pathname: "/(essentials)/account/verify",
					params: {
						entry: email,
						source: "email",
						verificationId: email,
					},
				});
			}
		} else {
			if (phoneNumber) {
				const confirm = await verifyPhoneNumber(getAuth(), phoneNumber, false);
				setIsLoading(false);
				router.navigate({
					pathname: "/(essentials)/account/verify",
					params: {
						entry: phoneNumber,
						source: "phone",
						verificationId: confirm.verificationId,
					},
				});
			}
		}
	};
	return (
		<Screen title={`Link ${params.link}`}>
			<XStack gap="$sm" py="$xl">
				<Stack bg="$accent1" height={6} width="12%" rounded="$2xl" />
				<Stack bg="$tealThemed" height={6} width="12%" rounded="$2xl" />
			</XStack>
			<YStack width="92%" items="center" gap="$xl">
				<Text color="$neutral2" text="center" width="85%">
					{`Enter your ${isEmail ? "email" : "phone number"} to link, we may store and send a verification code to this ${isEmail ? "email" : "number"}`}
				</Text>
				<Stack minW="95%">
					{isEmail ? (
						<TextInput
							placeholder="user@mail.com"
							fontSize="$lg"
							py="$md"
							autoFocus
							rounded="$vl"
							keyboardType="email-address"
							onChangeText={setEmail}
						/>
					) : (
						<PhoneInput onChangeText={setPhoneNumber} autoFocus />
					)}
				</Stack>
			</YStack>
			<Spacer />
			<Button
				variant="branded"
				loading={isLoading}
				onPress={onPressContinue}
				position="absolute"
				size="lg"
				b="$3xl"
				width="85%"
			>
				Continue
			</Button>
		</Screen>
	);
}

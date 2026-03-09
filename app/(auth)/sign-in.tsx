import {
	GoogleSignIn,
	TermsOfService,
	useOnboardingContext,
} from "@/features/essentials";
import {
	AnimatedYStack,
	Button,
	PhoneInput,
	Separator,
	Stack,
	Text,
	TextInput,
	TouchableArea,
	View,
	XStack,
	YStack,
} from "@/ui";
import { RegisterHeader } from "@/ui/assets";
import { router } from "expo-router";
import { useState } from "react";
import { Image } from "react-native";

export default function SignInScreen() {
	const [useEmail, setUseEmail] = useState<boolean>(false);
	const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
	const [email, setEmail] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { sendPhoneOTP, sendEmailOTP } = useOnboardingContext();

	const onPressContinue = async () => {
		setIsLoading(true);
		if (useEmail) {
			if (email) {
				await sendEmailOTP(email);
				setIsLoading(false);
				router.push({
					pathname: "/(auth)/verify",
					params: {
						entry: email,
						source: "email",
					},
				});
			}
		} else {
			if (phoneNumber) {
				await sendPhoneOTP(phoneNumber);
				setIsLoading(false);
				router.push({
					pathname: "/(auth)/verify",
					params: {
						entry: phoneNumber,
						source: "phone",
					},
				});
			}
		}
	};
	return (
		<View flex={1} bg="$surface1" items="center">
			<AnimatedYStack grow={1} width="95%" items="center" gap="$md">
				<XStack gap="$sm" py="$xl">
					<Stack bg="$accent1" height={6} width="15%" rounded="$2xl" />
					<Stack bg="$tealThemed" height={6} width="15%" rounded="$2xl" />
					<Stack bg="$tealThemed" height={6} width="15%" rounded="$2xl" />
					<Stack bg="$tealThemed" height={6} width="15%" rounded="$2xl" />
				</XStack>
				<Image
					resizeMode="contain"
					source={RegisterHeader}
					style={{ width: "100%", height: "15%", opacity: 0.85 }}
				/>
				<Text allowFontScaling={false} text="center" variant="subHeading1">
					Let's get you started
				</Text>
				<Text color="$neutral2" text="center" width="85%">
					{`Enter your ${useEmail ? "email" : "phone number"} to get started, we may store and send a verification code to this ${useEmail ? "email" : "number"}`}
				</Text>
				<YStack gap="$sm" minW="95%" mt="$md">
					{useEmail ? (
						<TextInput
							placeholder="user@mail.com"
							fontSize="$lg"
							py="$md"
							rounded="$vl"
							keyboardType="email-address"
							onChangeText={setEmail}
						/>
					) : (
						<PhoneInput onChangeText={setPhoneNumber} />
					)}
					<Button
						variant="branded"
						size="lg"
						loading={isLoading}
						onPress={onPressContinue}
					>
						Continue
					</Button>
					<XStack justify="space-between" px="$xs">
						<Text color="$neutral2">
							{useEmail ? "Prefer phone sign up?" : "Prefer email sign up?"}
						</Text>
						<TouchableArea hitSlop={16} onPress={() => setUseEmail(!useEmail)}>
							<Text color="$accent1" variant="buttonLabel2" mr="$3xs">
								{useEmail ? "Use phone" : "Use Email"}
							</Text>
						</TouchableArea>
					</XStack>
					<XStack items="center" my="$md">
						<Separator borderWidth={1} />
						<Text variant="body2" mx="$sm">
							OR
						</Text>
						<Separator borderWidth={1} />
					</XStack>
					<GoogleSignIn />
				</YStack>
				<Stack mx="$2xl" py="$xl">
					<TermsOfService />
				</Stack>
			</AnimatedYStack>
		</View>
	);
}

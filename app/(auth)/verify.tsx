import { HeaderBackButton } from "@/components/Buttons/HeaderNavButtons";
import { ResendTimer, useOnboardingContext } from "@/features/essentials";
import {
	AnimatedYStack,
	SpinningLoader,
	Stack,
	Text,
	View,
	XStack,
	YStack,
} from "@/ui";
import { RegisterHeader } from "@/ui/assets";
import { CodeInput, type CodeInputRef } from "@/ui/components/input/CodeInput";
import { logger } from "@/utilities/logger/logger";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Image } from "react-native";

export default function VerifyScreen() {
	const params = useLocalSearchParams<{ source: string; entry: string }>();
	const codeInputRef = useRef<CodeInputRef>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const { signInWithOTP, sendEmailOTP, sendPhoneOTP, getSignedInUser } =
		useOnboardingContext();

	const handleVerification = async (code: string) => {
		try {
			setIsError(false);
			const userCred = await signInWithOTP(code, params.source);
			const user = getSignedInUser();
			console.log(user);
			if (user || userCred) {
				setIsLoading(false);
				router.push("/(auth)/security");
			} else {
				setIsLoading(false);
				setIsError(true);
				codeInputRef.current?.clear();
			}
		} catch (error) {
			logger.error(error, {
				tags: {
					file: "verification screen",
					function: "handleVerification",
				},
			});
		}
	};

	const handleResendCode = async () => {
		setIsLoading(true);
		if (params.source === "phone") {
			await sendPhoneOTP(params.entry);
		} else {
			await sendEmailOTP(params.entry);
		}
		setIsLoading(false);
	};
	return (
		<View flex={1} bg="$surface1" items="center">
			<AnimatedYStack grow={1} width="95%" items="center" gap="$xl">
				<XStack gap="$2xl" items="center" width="95%">
					<HeaderBackButton />
					<XStack gap="$sm" py="$xl" width="100%">
						<Stack bg="$tealThemed" height={6} width="15%" rounded="$2xl" />
						<Stack bg="$accent1" height={6} width="15%" rounded="$2xl" />
						<Stack bg="$tealThemed" height={6} width="15%" rounded="$2xl" />
						<Stack bg="$tealThemed" height={6} width="15%" rounded="$2xl" />
					</XStack>
				</XStack>
				<Image
					resizeMode="contain"
					source={RegisterHeader}
					style={{ width: "100%", height: "15%", opacity: 0.85 }}
				/>
				<YStack width="95%" items="center" gap="$md">
					<Text allowFontScaling={false} text="center" variant="subHeading1">
						{`Verify your ${params.source === "phone" ? "phone number" : "email"}`}
					</Text>
					<Text color="$neutral2" text="center" width="85%">
						Enter the verification code we sent to:
						<Text variant="subHeading2" color="$neutral2">
							{" "}
							{params.entry}
						</Text>
					</Text>
				</YStack>
				<CodeInput
					ref={codeInputRef}
					onFilled={(code) => {
						setIsLoading(true);
						handleVerification(code);
					}}
					//blurOnFilled={!isError}
				/>
				{isLoading ? <SpinningLoader size={28} /> : null}
				{isError ? (
					<Text color="$statusCritical">Ops! code mismatch</Text>
				) : null}
				<ResendTimer
					onResend={handleResendCode}
					isSourcePhone={params.source === "phone"}
				/>
			</AnimatedYStack>
		</View>
	);
}

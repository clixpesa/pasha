import { Screen } from "@/components/layout/Screen";
import { ResendTimer } from "@/features/essentials";
import { CodeInput, SpinningLoader, Stack, Text, XStack, YStack } from "@/ui";
import { logger } from "@/utilities/logger/logger";
import {
	EmailAuthProvider,
	PhoneAuthProvider,
	getAuth,
	linkWithCredential,
	verifyPhoneNumber,
} from "@react-native-firebase/auth";
import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";

export default function VerifyEmailPhone() {
	const params = useLocalSearchParams<{
		source: string;
		entry: string;
		verificationId: string;
	}>();
	const user = getAuth().currentUser;
	const codeInputRef = useRef(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [verificationId, setVerificationId] = useState<string>(
		params.verificationId,
	);
	const handleVerification = async (code: string) => {
		try {
			if (params.source === "phone") {
				const credential = PhoneAuthProvider.credential(verificationId, code);
				const result = await linkWithCredential(user, credential);
				await updateDoc(doc(getFirestore(), "USERS", user?.uid), {
					phoneNumber: params.entry,
				});
			} else if (params.source === "email") {
				const instance = httpsCallable(getFunctions(), "verifyEmailWithOTP");
				const response = (await instance({
					email: verificationId,
					otp: code,
				})) as {
					data: {
						message: string;
					};
				};
				if (verificationId && response) {
					const credential = EmailAuthProvider.credential(
						verificationId,
						response?.data.message,
					);
					await linkWithCredential(user, credential);
					await updateDoc(doc(getFirestore(), "USERS", user?.uid), {
						email: params.entry,
					});
				}
			}
			setIsLoading(false);
			//router.replace("/(essentials)/account/edit-profile");
			router.back();
			router.back();
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
			const confirm = await verifyPhoneNumber(getAuth(), params.entry, false);
			setVerificationId(confirm?.verificationId);
		} else {
			const instance = httpsCallable(getFunctions(), "sendEmailOTP");
			const response = await instance({ email: params.entry });
			setVerificationId(params.entry);
		}
		setIsLoading(false);
	};
	return (
		<Screen title={`Verify ${params.source}`}>
			<XStack gap="$sm" py="$xl">
				<Stack bg="$tealThemed" height={6} width="12%" rounded="$2xl" />
				<Stack bg="$accent1" height={6} width="12%" rounded="$2xl" />
			</XStack>

			<YStack width="95%" items="center" gap="$md">
				<Text color="$neutral2" text="center" width="85%">
					Enter the verification code we sent to:
					<Text variant="subHeading2" color="$neutral2">
						{" "}
						{params.entry}
					</Text>
				</Text>

				<CodeInput
					ref={codeInputRef}
					onFilled={(code) => {
						setIsLoading(true);
						handleVerification(code);
					}}
					blurOnFilled
				/>
				{isLoading ? <SpinningLoader size={28} /> : null}
				<ResendTimer
					onResend={handleResendCode}
					isSourcePhone={params.source === "phone"}
				/>
			</YStack>
		</Screen>
	);
}

import { HeaderBackButton } from "@/components/Buttons/HeaderNavButtons";
import { useOnboardingContext } from "@/features/essentials";
import {
	AnimatedYStack,
	SpinningLoader,
	Stack,
	Text,
	TouchableArea,
	View,
	XStack,
	YStack,
} from "@/ui";
import { SecurityHeader } from "@/ui/assets";
import { CodeInput, type CodeInputRef } from "@/ui/components/input/CodeInput";
import { getAuth, getIdTokenResult } from "@react-native-firebase/auth";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image } from "react-native";

export default function SecurityScreen() {
	const isBiometricCapable = false;
	const codeInputRef = useRef<CodeInputRef>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [use4Digits, setUse4Digits] = useState<boolean>(false);
	const [initialCode, setInitialCode] = useState<string | undefined>(undefined);
	const [isError, setIsError] = useState<boolean>(false);
	const [tag, setTag] = useState<string | null>(null);
	const { getSignedInUser, storeMnemonic } = useOnboardingContext();

	useEffect(() => {
		(async () => {
			const user = getAuth().currentUser;
			if(user){
				const clixtag = await getIdTokenResult(user, true).then(
				(tokenResults) => tokenResults.claims.tag,
			);
			setTag(clixtag);
			}
		})();
	}, []);

	const handleVerification = async (code: string) => {
		try {
			if (!initialCode) {
				setInitialCode(code);
				codeInputRef.current?.clear();
			} else {
				setIsError(false);
				if (initialCode === code) {
					setIsLoading(true);
					const user = getSignedInUser();
					if (user) await storeMnemonic(user?.uid);
					setTimeout(() => {
						setIsLoading(false);
						if (tag) {
							router.replace("/");
						} else {
							router.push("/(auth)/username");
						}
					}, 1000);
				} else {
					setIsError(true);
					codeInputRef.current?.clear();
				}
			}
		} catch (e) {
			console.warn(e);
		}
	};

	return (
		<View flex={1} bg="$surface1" items="center">
			<AnimatedYStack grow={1} width="95%" items="center" gap="$xl">
				<XStack gap="$2xl" items="center" width="95%">
					<HeaderBackButton />
					<XStack gap="$sm" py="$xl" width="100%">
						<Stack bg="$tealThemed" height={6} width="15%" rounded="$2xl" />
						<Stack bg="$tealThemed" height={6} width="15%" rounded="$2xl" />
						<Stack bg="$accent1" height={6} width="15%" rounded="$2xl" />
						<Stack bg="$tealThemed" height={6} width="15%" rounded="$2xl" />
					</XStack>
				</XStack>
				<Image
					resizeMode="contain"
					source={SecurityHeader}
					style={{ width: "100%", height: "15%", opacity: 0.85 }}
				/>
				<YStack width="95%" items="center" gap="$md">
					<Text allowFontScaling={false} text="center" variant="subHeading1">
						Protect your wallet
					</Text>
					<Text color="$neutral2" text="center" width="85%">
						{`Adding ${isBiometricCapable ? "biometric security" : "a passcode"} will ensure that you are the only one with access.`}
					</Text>
				</YStack>
				<YStack items="center" gap="$lg">
					<Text>{`Enter ${initialCode ? "the" : "a"} ${use4Digits ? 4 : 6} digit passcode ${initialCode ? "again." : ""}`}</Text>
					<CodeInput
						ref={codeInputRef}
						numberOfDigits={use4Digits ? 4 : 6}
						onFilled={(code) => handleVerification(code)}
						secureTextEntry
					/>
					{initialCode ? (
						isError ? (
							<XStack justify="space-between" px="$xs" minW="80%">
								<Text color="$statusCritical">Ops! passcode mismatch</Text>
								<TouchableArea
									hitSlop={16}
									onPress={() => {
										codeInputRef.current?.clear();
										setInitialCode(undefined);
										setIsError(false);
									}}
								>
									<Text color="$accent1" variant="buttonLabel2" mr="$3xs">
										Start over
									</Text>
								</TouchableArea>
							</XStack>
						) : null
					) : (
						<XStack justify="space-between" px="$xs" minW="80%">
							<Text color="$neutral2">
								{use4Digits ? "Prefer 6 digit PIN?" : "Prefer 4 digit PIN?"}
							</Text>
							<TouchableArea
								hitSlop={16}
								onPress={() => {
									codeInputRef.current?.clear();
									setInitialCode(undefined);
									setUse4Digits(!use4Digits);
								}}
							>
								<Text color="$accent1" variant="buttonLabel2" mr="$3xs">
									{use4Digits ? "Use 6 Digits" : "Use 4 Digits"}
								</Text>
							</TouchableArea>
						</XStack>
					)}
					{isLoading ? <SpinningLoader size={28} /> : null}
				</YStack>
			</AnimatedYStack>
		</View>
	);
}

import { Button } from "@/ui";
import { Google } from "@/ui/components/icons";
import { getUrlSafeNonce } from "@/utilities/auth/getNonce";
import {
	GoogleOneTapSignIn,
	isErrorWithCode,
	isNoSavedCredentialFoundResponse,
	isSuccessResponse,
	statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useState } from "react";
import { useOnboardingContext } from "../contexts/OnboardingContext";

export const GoogleSignIn = () => {
	const { verifyGoogleIdToken } = useOnboardingContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const signInWithGoogle = async () => {
		setIsLoading(true);
		try {
			GoogleOneTapSignIn.configure({
				webClientId: "autoDetect",
			});
			await GoogleOneTapSignIn.checkPlayServices();
			const response = await GoogleOneTapSignIn.signIn();

			if (isSuccessResponse(response)) {
				const idToken = response.data?.idToken;
				await verifyGoogleIdToken(idToken);
			} else if (isNoSavedCredentialFoundResponse(response)) {
				// Android and Apple only.
				// No saved credential found (user has not signed in yet, or they revoked access)
				// call `createAccount()`
				const createResponse = await GoogleOneTapSignIn.createAccount({
					nonce: getUrlSafeNonce(),
				});
				const idToken = createResponse.data?.idToken;
				if (idToken) {
					await verifyGoogleIdToken(idToken);
				}
			} else if (isNoSavedCredentialFoundResponse(response)) {
				/// last resort: explicit sign in
				const explicitResponse = await GoogleOneTapSignIn.presentExplicitSignIn(
					{
						nonce: getUrlSafeNonce(),
					},
				);
				const idToken = explicitResponse.data?.idToken;
				if (idToken) {
					await verifyGoogleIdToken(idToken);
				}
			}
			setIsLoading(false);
			router.navigate("/(auth)/security");
		} catch (error) {
			console.error(error);
			setIsLoading(false);
			if (isErrorWithCode(error)) {
				switch (error.code) {
					case statusCodes.ONE_TAP_START_FAILED:
						// Android-only, you probably have hit rate limiting.
						// You can still call `presentExplicitSignIn` in this case.
						break;
					case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
						// Android: play services not available or outdated.
						// Get more details from `error.userInfo`.
						// Web: when calling an unimplemented api (requestAuthorization)
						// or when the Google Client Library is not loaded yet.
						break;
					default:
					// something else happened
				}
			} else {
				// an error that's not related to google sign in occurred
			}
		}
	};

	return (
		<Button
			onPress={() => signInWithGoogle()}
			icon={<Google />}
			gap="$sm"
			animation="200ms"
			loading={isLoading}
			emphasis="secondary"
			size="lg"
		>
			{isLoading ? "Signing you in .." : "Sign in with Google"}
		</Button>
	);
};

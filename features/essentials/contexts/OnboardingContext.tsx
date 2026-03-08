import { appStorage } from "@/store/storage";
import { logger } from "@/utilities/logger/logger";
import {
	type FirebaseAuthTypes,
	GoogleAuthProvider,
	PhoneAuthProvider,
	getAuth,
	onAuthStateChanged,
	signInWithCredential,
	signInWithEmailAndPassword,
	signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";
import React, {
	type PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

export type OnboardingContext = {
	signInWithOTP: (
		code: string,
		source: string,
	) => Promise<FirebaseAuthTypes.UserCredential | undefined>;
	sendPhoneOTP: (phoneNumber: string) => Promise<void>;
	sendEmailOTP: (email: string) => Promise<void>;
	storeMnemonic: (keyParams: string) => Promise<void>;
	createClixtag: (userName: string) => Promise<string | null>;
	getSignedInUser: () => FirebaseAuthTypes.User | null;
	resetOnboardingContextData: () => void;
	verifyGoogleIdToken: (
		idToken: string,
	) => Promise<FirebaseAuthTypes.UserCredential | undefined>;
};

const initialOnboardingContext: OnboardingContext = {
	//signInWithGoogle: async () => undefined,
	signInWithOTP: async () => undefined,
	sendPhoneOTP: async () => undefined,
	sendEmailOTP: async () => undefined,
	storeMnemonic: async () => undefined,
	createClixtag: async () => null,
	getSignedInUser: () => null,
	resetOnboardingContextData: () => undefined,
	verifyGoogleIdToken: async () => undefined,
};

const OnboardingContext = createContext<OnboardingContext>(
	initialOnboardingContext,
);

export function OnboardingContextProvider({
	children,
}: PropsWithChildren<unknown>): React.JSX.Element {
	const [signedInUser, setSignedInUser] =
		useState<FirebaseAuthTypes.User | null>(null);
	const [verificationId, setVerificationId] = useState<string | null>(null);

	useEffect(() => {
		const subscriber = onAuthStateChanged(getAuth(), (user) => {
			setSignedInUser(user);
		});

		return subscriber; // unsubscribe on unmount
	}, []);

	const sendPhoneOTP = async (phoneNumber: string) => {
		resetOnboardingContextData();
		try {
			const confirm = await signInWithPhoneNumber(getAuth(), phoneNumber);
			setVerificationId(confirm.verificationId);
		} catch (error) {
			logger.error(error, {
				tags: {
					file: "OnboardingContext",
					function: "sendPhoneOTP",
				},
			});
		}
	};

	const sendEmailOTP = async (email: string) => {
		resetOnboardingContextData();
		try {
			const instance = httpsCallable(getFunctions(), "sendEmailOTP");
			const response = await instance({ email, isSignIn: true });
			setVerificationId(email);
		} catch (error) {
			logger.error(error, {
				tags: {
					file: "OnboardingContext",
					function: "sendEmailOTP",
				},
			});
		}
	};

	const signInWithOTP = async (code: string, source: string) => {
		try {
			let userCredential = undefined;
			if (source === "phone") {
				const credential = PhoneAuthProvider.credential(verificationId, code);
				userCredential = await signInWithCredential(getAuth(), credential);
				//await storeMnemonic(userCredential.user.uid);
				setSignedInUser(userCredential.user);
			} else if (source === "email") {
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
					userCredential = await signInWithEmailAndPassword(
						getAuth(),
						verificationId,
						response.data?.message,
					);
					setSignedInUser(userCredential.user);
				}
			}
			return userCredential;
		} catch (error) {
			logger.error(error, {
				tags: { file: "OnboardingContext", function: "signInWithOTP" },
			});
		}
	};

	const verifyGoogleIdToken = async (idToken: string) => {
		try {
			const googleCredential = GoogleAuthProvider.credential(idToken);
			const userCredential = await signInWithCredential(
				getAuth(),
				googleCredential,
			);
			setSignedInUser(userCredential.user);
			return userCredential;
		} catch (error) {
			logger.error(error, {
				tags: {
					file: "OnboardingContext",
					function: "verifyGoogleIdToken",
				},
			});
		}
	};

	const getSignedInUser = (): FirebaseAuthTypes.User | null => {
		return signedInUser;
	};

	const storeMnemonic = async (userId: string) => {
		const instance = httpsCallable(getFunctions(), "getStoredNode");
		const mnemonicData = (await instance({ userId })).data;
		await appStorage.setItem(userId, mnemonicData);
	};

	const createClixtag = async (userName: string): Promise<string | any> => {
		const instance = httpsCallable(getFunctions(), "createAndStoreTag");
		const tag = (await instance({ userId: signedInUser?.uid, tag: userName }))
			.data;
		return tag;
	};

	const resetOnboardingContextData = (): void => {
		setSignedInUser(null);
		setVerificationId(null);
	};

	return (
		<OnboardingContext.Provider
			value={{
				//signInWithGoogle,
				sendPhoneOTP,
				sendEmailOTP,
				signInWithOTP,
				storeMnemonic,
				createClixtag,
				getSignedInUser,
				resetOnboardingContextData,
				verifyGoogleIdToken,
			}}
		>
			{children}
		</OnboardingContext.Provider>
	);
}

export function useOnboardingContext(): OnboardingContext {
	return useContext(OnboardingContext);
}

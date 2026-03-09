import { zustandMmkvStorage } from "@/store/storage";
import { isSameAddress } from "@/utilities/addresses";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { useEffect } from "react";
import type { Address } from "viem";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AppState {
	hasAccount: boolean;
	isUnlocked: boolean;
	testnetEnabled?: boolean; // Optional property for testnet
	user: {
		uid: string;
		name?: string; // Optional property for user full name
		email?: string;
		phoneNumber?: string;
		mainAddress?: Address;
		invtAddress?: Address;
		bizAddress?: Address;
	};
	recentRecipients: {
		id: string;
		name: string;
		address: string;
		phone: string;
	}[];
	setHasAccount: (value: boolean) => void;
	setIsUnlocked: (value: boolean) => void;
	setTestnetEnabled: (value: boolean) => void;
	setUser: (user: {
		uid: string;
		name?: string;
		email?: string;
		phoneNumber?: string;
	}) => void;
	setUserAddresses: (mainAddress?: Address, invtAddress?: Address, bizAddress?: Address) => void;
	setRecentRecipient: (
		id: string,
		name: string,
		address: string,
		phone: string,
	) => void;
}

const initialAppState = {
	hasAccount: false,
	isUnlocked: false,
	testnetEnabled: true, // Default to false, can be set later
	user: {
		uid: "",
		name: "",
		email: undefined,
		phoneNumber: undefined,
		eoaAddress: undefined,
		mainAddress: undefined,
	},
	recentRecipients: [],
};

export const useAppState = create<AppState>()(
	persist(
		(set, get) => ({
			...initialAppState,
			setHasAccount: (value) => set({ hasAccount: value }),
			setIsUnlocked: (value) => set({ isUnlocked: value }),
			setTestnetEnabled: (value) => set({ testnetEnabled: value }),
			setUser: (user) => set({ user }),
			setUserAddresses: (mainAddress, invtAddress, bizAddress) =>
				set((state) => ({
					user: {
						...state.user,		
						mainAddress,
						invtAddress,
						bizAddress,
					},
				})),
			setRecentRecipient: (id, name, address, phone) => {
				const recipients = get().recentRecipients;
				if (
					recipients.find((recipient) =>
						isSameAddress(recipient.address, address),
					)
				)
					return;
				if (recipients.length === 3) recipients.pop();
				if (recipients.length > 0) {
					recipients.unshift({
						id,
						name,
						address,
						phone,
					});
				} else {
					recipients.push({ id, name, address, phone });
				}
				set({ recentRecipients: recipients });
			},
		}),
		{
			name: "app-state",
			storage: createJSONStorage(() => zustandMmkvStorage),
			version: 1,

			partialize: (state) => ({
				hasAccount: state.hasAccount,
				user: state.user,
				recentRecipients: state.recentRecipients,
			}),
		},
	),
);

export const useHasAccount = () => {
	useEffect(() => {
		const subscriber = onAuthStateChanged(getAuth(), async (user) => {
			//if (user) await appStorage.setItem("user", user.toJSON());
			const thisUser = useAppState.getState().user;
			//console.log("Auth state changed:", user);
			useAppState.getState().setHasAccount(!!user);
			if (user) {
				const { uid, displayName, email, phoneNumber } = user;
				useAppState.getState().setUser({
					...thisUser,
					uid,
					name: displayName || undefined,
					email: email || undefined,
					phoneNumber: phoneNumber || undefined,
				});
			}
		});

		return subscriber; // unsubscribe on unmount
	}, []);
	return useAppState((state) => state.hasAccount);
};

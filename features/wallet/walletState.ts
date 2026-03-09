import { zustandMmkvStorage } from "@/store/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getAvailableOverdraft } from "../contracts/overdraft";
import { fetchTokenBalances } from "./tokens/fetchBalances";
import {
	type Address,
	type Balance,
	type ChainId,
	Currency,
	MethodId,
	type ProviderDetails,
	type ProviderId,
	type RampsAccountDetails,
	type TokenId,
} from "./types";
interface WalletState {
	currency: Currency;
	tokenBalances: Record<TokenId, Balance>; // Record of address to Balance
	overdraft: Balance;
	onramp: {
		method: MethodId;
		provider: ProviderId;
		details?: ProviderDetails;
	};
	fetchBalances: (
		address: Address,
		chainId: ChainId,
		isTestnet: boolean,
		rate: number,
	) => Promise<void>;
	updateOverdraft: (amount: Balance["balanceUSD"], rate: number) => void;
	setMethod: (method: MethodId) => void;
	setProvider: (provider: ProviderId, accDetails?: RampsAccountDetails) => void;
	setPrefferredProvider: (provider: ProviderId) => void;
	setOnramp: (
		provider: ProviderId,
		method: MethodId,
		details: ProviderDetails,
	) => void;
}

const initialWalletState = {
	currency: Currency.KES,
	tokenBalances: {},
	overdraft: {
		balance: 0,
		balanceUSD: 0,
	},
	onramp: {
		method: MethodId.MobileMoney,
		provider: `${MethodId.MobileMoney}_MPESA` as ProviderId,
	},
};

export const useWalletState = create<WalletState>()(
	persist(
		(set, get) => ({
			...initialWalletState,
			fetchBalances: async (address, chainId, isTestnet, rate) => {
				//const currency = get().currency;
				//const { conversionRate } = getRate(currency);

				const tokenBalances = await fetchTokenBalances(
					address,
					rate,
					isTestnet,
				);
				const availableLimit = await getAvailableOverdraft({
					chainId,
					address,
				});
				const overdraft = {
					balance: Number(availableLimit),
					balanceUSD: Number(availableLimit) / rate,
				};
				set({ tokenBalances, overdraft });
			},
			updateOverdraft: async (amount: Balance["balanceUSD"], rate) => {
				const currency = get().currency;
				//const { conversionRate } = getRate(currency);
				//const { data } = await getCachedRates(currency);
				const overdraft = {
					balance: amount * rate, //conversionRate,
					balanceUSD: amount,
				};
				set({ overdraft });
			},
			setMethod: (method: MethodId) => {
				set((state) => ({
					onramp: {
						...state.onramp,
						method,
					},
				}));
			},
			setPrefferredProvider: (provider: ProviderId) => {
				set((state) => ({
					onramp: {
						...state.onramp,
						provider,
					},
				}));
			},
			setProvider: (provider: ProviderId, accDetails?: RampsAccountDetails) => {
				const details = get().onramp.details || {};
				if (accDetails) {
					details[provider] = accDetails;
				}
				set((state) => ({
					onramp: {
						...state.onramp,
						provider,
						details,
					},
				}));
			},
			setOnramp: (
				provider: ProviderId,
				method: MethodId,
				details: ProviderDetails,
			) => {
				set({
					onramp: {
						provider,
						method,
						details,
					},
				});
			},
		}),
		{
			name: "wallet-state",
			storage: createJSONStorage(() => zustandMmkvStorage),
			version: 1,

			partialize: (state) => ({
				onramp: state.onramp,
			}),
		},
	),
);

export const useBalances = () => {
	const tokenBalances = useWalletState((s) => s.tokenBalances);
	const currency = useWalletState((s) => s.currency);
	const overdraft = useWalletState((s) => s.overdraft);
	const balances = Object.values(tokenBalances);
	const totalBalanceUSD = balances.reduce(
		(sum, bal) => sum + (bal.balanceUSD || 0),
		0,
	);

	return {
		totalBalanceUSD,
		tokenBalances,
		overdraft,
		currency,
	};
};

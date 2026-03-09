import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import {
	type Address,
	type PublicClient,
	type WalletClient,
	createPublicClient,
	createWalletClient,
	http,
} from "viem";
import { entryPoint07Address } from "viem/account-abstraction";

import { useAppState } from "@/features/essentials/appState";
import { appStorage } from "@/store/storage";
import { getAuth, getIdTokenResult } from "@react-native-firebase/auth";
import { mnemonicToAccount } from "viem/accounts";
import {
	type SmartAccountClient,
	createSmartAccountClient,
} from "../account-abstraction/createSmartAccountClient";
import { toSimpleSmartAccount } from "../account-abstraction/toSimpleSmartAccount";
import { createPimlicoClient } from "../bundler/pimlico";
import { getChainInfo, getEnabledChains} from "../chains/utils";
import { useEnabledChains } from "../hooks";
import { ChainId, type MnemonicData } from "../types";
import { decryptMnemonic } from "../utils";

export interface WalletContext {
	eoaAccount: WalletClient | null;
	mainAccount: SmartAccountClient | null;
	publicClient: PublicClient | null;
	isInitialized: boolean;
	isLoading: boolean;
	error: Error | null;
	currentChainId: ChainId;
	updateCurrentChainId: (chainId: ChainId) => void;
}

const initialWalletContext: WalletContext = {
	eoaAccount: null,
	mainAccount: null,
	publicClient: null,
	isInitialized: false,
	isLoading: false,
	error: null,
	currentChainId: ChainId.Avalanche, // Default chain ID
	updateCurrentChainId: () => {},
};

export const WalletContext = createContext<WalletContext>(initialWalletContext);

export function WalletContextProvider({
	children,
}: PropsWithChildren): JSX.Element {
	const { chains, defaultChainId } = useEnabledChains();
	//console.log(chains);
	const setUserAddresses = useAppState((s) => s.setUserAddresses);
	const isTestnetEnabled = useAppState((s) => s.testnetEnabled);
	const [state, setState] = useState<
		Omit<WalletContext, "isLoading" | "currentChainId" | "updateCurrentChainId">
	>({
		eoaAccount: null,
		mainAccount: null,
		publicClient: null,
		isInitialized: false,
		error: null,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [currentChainId, setCurrentChainId] = useState<ChainId>(defaultChainId);
	//const chains = getEnabledChains(isTestnetEnabled);
	//console.log(chains);
	const currentChain = useMemo(() => {
		const chainId = chains.find((chain) => chain === currentChainId);
		return chainId ? getChainInfo(chainId) : null;
	}, [currentChainId, chains]);

	//console.log(currentChain);

	const updateCurrentChainId = useCallback((chainId: ChainId) => {
		setCurrentChainId(chainId);
	}, []);

	const getMnemonic = useCallback(async (): Promise<{
		phrase: string;
		path: string;
		locale: string;
	} | null> => {
		const user = getAuth().currentUser;
		if (!user) {
			throw new Error("User not authenticated");
		}
		try {
			const enMnemonicData = (await appStorage.getItem(
				user.uid,
			)) as MnemonicData | null;
			if (!enMnemonicData || !enMnemonicData.enMnemonic) {
				throw new Error("Mnemonic data not found");
			}
			const tokenResult = await getIdTokenResult(user, true);
			const mnemonicId = tokenResult.claims.mnemonicId;
			const keyParams = user.uid + mnemonicId;
			const mnemonic = await decryptMnemonic(
				enMnemonicData.enMnemonic,
				keyParams,
			);
			if (!mnemonic) throw new Error("Failed to decrypt mnemonic");
			return JSON.parse(mnemonic);
		} catch (error) {
			console.error("Error getting mnemonic:", error);
			return null;
		}
	}, []);

	const initializeWallet = useCallback(async () => {
		console.log("Changing wallets");
		setIsLoading(true);
		const user = getAuth().currentUser;
		try {
			if (!currentChain || !user) throw new Error("Chain or user not found");
			const mnemonic: { phrase: string; path: string; locale: string } | null =
				await getMnemonic();
			if (!mnemonic) throw new Error("Mnemonic not found");

			const account0 = mnemonicToAccount(mnemonic.phrase, {accountIndex: 0});
			const account1 = mnemonicToAccount(mnemonic.phrase, {accountIndex: 1});
			const account2 = mnemonicToAccount(mnemonic.phrase, {accountIndex: 2});
			
			const eoaAccount = createWalletClient({
				chain: currentChain,
				transport: http(currentChain.rpcUrl.http[0]),
				account: account0,
			});

			const publicClient = createPublicClient({
				chain: currentChain,
				transport: http(currentChain.rpcUrls.default.http[0]),
			});

			const pimlicoClient = createPimlicoClient({
				entryPoint: {
					address: entryPoint07Address,
					version: "0.7",
				},
				transport: http(
					`https://api.pimlico.io/v2/${currentChain.id}/rpc?apikey=pim_MsujSudd323K1KGSmMuLCJ`,
				),
			});

			const smartAccount = await toSimpleSmartAccount({
				client: publicClient,
				owner: account0,
				entryPoint: {
					address: entryPoint07Address,
					version: "0.7",
				},
			});

			const invtAccount = await toSimpleSmartAccount({
				client: publicClient,
				owner: account1,
				entryPoint: {
					address: entryPoint07Address,
					version: "0.7",
				},
			});

			const bizAccount = await toSimpleSmartAccount({
				client: publicClient,
				owner: account2,
				entryPoint: {
					address: entryPoint07Address,
					version: "0.7",
				},
			});

			const mainAccount = createSmartAccountClient({
				account: smartAccount,
				chain: currentChain,
				bundlerTransport: http(
					`https://api.pimlico.io/v2/${currentChain.id}/rpc?apikey=pim_MsujSudd323K1KGSmMuLCJ`,
				),
				paymaster: pimlicoClient,
				userOperation: {
					estimateFeesPerGas: async () => {
						return (await pimlicoClient.getUserOperationGasPrice()).fast;
					},
				},
			});

			setUserAddresses(mainAccount.account.address, invtAccount.address, bizAccount.address);
			setState({
				eoaAccount,
				mainAccount,
				publicClient,
				isInitialized: true,
				error: null,
			});
			const bytecode = await publicClient.getCode({
				address: mainAccount.account.address as Address,
			});
			if (!bytecode || bytecode === "0x") {
				await mainAccount?.sendTransaction({
					to: "0xDE0B552766A0B93B0c405f56c6D0999b9916790A",
					data: "0x",
					value: 0n,
				});
				console.log("account deployed");
			}
		} catch (error) {
			console.error("Error initializing wallet:", error);
			setState((prev) => ({
				...prev,
				error: error instanceof Error ? error : new Error("Unknown error"),
			}));
		} finally {
			setIsLoading(false);
		}
	}, [currentChain, getMnemonic, setUserAddresses]);

	useEffect(() => {
		if (currentChain) {
			initializeWallet();
		}
	}, [currentChain, initializeWallet]);

	const value = useMemo<WalletContext>(
		() => ({
			...state,
			isLoading,
			currentChainId,
			updateCurrentChainId,
		}),
		[state, isLoading, currentChainId, updateCurrentChainId],
	);

	return (
		<WalletContext.Provider value={value}>{children}</WalletContext.Provider>
	);
}

export function useWalletContext(): WalletContext {
	const context = useContext(WalletContext);
	if (!context) {
		throw new Error(
			"useWalletContext must be used within a WalletContextProvider",
		);
	}
	return context;
}

export function usePublicClient(): PublicClient | null {
	const { publicClient } = useContext(WalletContext);
	return publicClient;
}

export function useMainAccount(): SmartAccountClient | null {
	const { mainAccount } = useContext(WalletContext);
	return mainAccount;
}

export function useInvtAccount(): WalletClient | null {
	const { eoaAccount } = useContext(WalletContext);
	return eoaAccount;
}

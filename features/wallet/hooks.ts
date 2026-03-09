import { useAppState } from "@/features/essentials/appState";
import { getEnabledChains } from "./chains/utils";
import { getEnabledTokens } from "./tokens/utils";
import {
	type Balance,
	ChainId,
	type EnabledChainsInfo,
	type TokenId,
	type TokenWithBalance,
} from "./types";
import { useWalletState } from "./walletState";

export function useEnabledChains(): EnabledChainsInfo {
	const isTestnet = useAppState((state) => state.testnetEnabled);
	const chainIds = getEnabledChains(isTestnet);
	/*const chains = chainIds.map((chainId) => {
		const chainInfo = getChainInfo(chainId);
		return {
			...chainInfo,
		};
	});*/
	return {
		chains: chainIds,
		isTestnet: Boolean(isTestnet),
		defaultChainId: isTestnet ? ChainId.AvalancheFuji : ChainId.Avalanche,
	};
}

export function useEnabledTokens(): TokenWithBalance[] {
	const tokenBalances = useWalletState((s) => s.tokenBalances);
	const { chains } = useEnabledChains();
	const tokens = getEnabledTokens(chains);
	return tokens.map((token) => {
		const tokenId: TokenId = `${token.symbol}_${token.chainId}`;
		const bal: Balance = tokenBalances[tokenId];
		return {
			...token,
			balance: bal ? bal.balance : 0,
			balanceUSD: bal ? bal.balanceUSD : 0,
		};
	});
}

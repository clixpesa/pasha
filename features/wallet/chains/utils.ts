import type { ChainId, ChainInfo } from "../types";
import { supportedChains } from "./supportedChains";

export function getChainInfo(chainId: ChainId): ChainInfo {
	return supportedChains[chainId];
}

export function getChainName(chainId: ChainId): string {
	return getChainInfo(chainId).name;
}

export function isTestnet(chainId: ChainId): boolean {
	return Boolean(supportedChains[chainId]?.testnet);
}

export const getEnabledChains = (isTestnet: boolean | undefined): ChainId[] => {
	const enabledChains: ChainId[] = [];
	if (isTestnet) {
		enabledChains.push(
			...Object.keys(supportedChains)
				.map((key) => Number(key) as ChainId)
				.filter((chainId) => supportedChains[chainId]?.testnet),
		);
	} else {
		enabledChains.push(
			...Object.keys(supportedChains)
				.map((key) => Number(key) as ChainId)
				.filter((chainId) => !supportedChains[chainId]?.testnet),
		);
	}
	return enabledChains;
};

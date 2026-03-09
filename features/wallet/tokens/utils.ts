import type { ChainId, Token, TokenId } from "../types";
import { supportedTokens } from "./supportedTokens";

export function getTokenId(chainId: ChainId, symbol: string): TokenId {
	return `${symbol}_${chainId}`;
}

export function getTokenById(tokenId: TokenId): Token {
	return supportedTokens[tokenId];
}

export function getTokensByChainId(chainId: ChainId): Token[] {
	return Object.values(supportedTokens).filter(
		(token) => token.chainId === chainId,
	);
}

export const getEnabledTokens = (chains: ChainId[]): Token[] => {
	return chains.flatMap((chainId) => {
		const chainTokens = getTokensByChainId(chainId);
		return Object.values(chainTokens);
	});
};

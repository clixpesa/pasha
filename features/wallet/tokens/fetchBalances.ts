import { createPublicClient, formatUnits, getContract, http } from "viem";
import { getChainInfo, getEnabledChains } from "../chains/utils";
import type { Address, Balance, TokenId } from "../types";
import { getEnabledTokens, getTokenId } from "./utils";

export const fetchTokenBalances = async (
	address: Address,
	rate: number,
	isTestnet: boolean,
): Promise<Record<TokenId, Balance>> => {
	const balances: Record<TokenId, Balance> = {};
	const chainIds = getEnabledChains(isTestnet);
	const tokens = getEnabledTokens(chainIds);
	const tokenBalancePromises = tokens.map(async (token) => {
		const tokenId = getTokenId(token.chainId, token.symbol);
		const currentChain = getChainInfo(token.chainId);
		if (!currentChain) {
			console.warn(`Chain info not found for chainId: ${token.chainId}`);
			return;
		}
		const publicClient = createPublicClient({
			chain: currentChain,
			transport: http(currentChain.rpcUrls.default.http[0]),
		});
		try {
			const contract = getContract({
				address: token.address,
				abi: [
					{
						inputs: [{ name: "owner", type: "address" }],
						name: "balanceOf",
						outputs: [{ name: "", type: "uint256" }],
						stateMutability: "view",
						type: "function",
					},
				],
				client: publicClient,
			});
			const rawBal = await contract.read.balanceOf([address]);
			const balance = rawBal ? Number(formatUnits(rawBal, token.decimals)) : 0;
			const balanceUSD =
				token.symbol.startsWith("Kx") || token.symbol.includes("KES")
					? balance / rate //rates.KES.conversionRate
					: balance * 1; // Assuming token.priceUSD is available
			balances[tokenId] = {
				balance: balance,
				balanceUSD: balanceUSD,
			};
		} catch (error) {
			console.error(`Error fetching balance for ${tokenId}:`, error);
			balances[tokenId] = {
				balance: 0,
				balanceUSD: 0,
			};
		}
	});
	await Promise.all(tokenBalancePromises);

	return balances;
};

import {
	type Address,
	type ChainId,
	type Token,
	type TokenId,
	getTokenById,
} from "@/features/wallet";
import { storage } from "@/store/storage";
import { throttle } from "@/utilities/time/timing";
import {
	type FetchArgs,
	createApi,
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const apiKey = process.env.EXPO_PUBLIC_BS_APIKEY;

// Cache key generator
const getCacheKey = (address: Address, tokens: Token[]) => {
	const tokenIds = tokens
		.map((t) => `${t.symbol}_${t.chainId}`)
		.sort()
		.join(",");
	return `transactions_${address}_${tokenIds}`;
};

// Cache management
const getCachedTransactions = async (address: Address, tokens: Token[]) => {
	try {
		const cacheKey = getCacheKey(address, tokens);
		const cached = storage.getString(cacheKey);
		if (cached) {
			const { data, timestamp } = JSON.parse(cached);
			// Return cached data if less than 5 minutes old
			if (Date.now() - timestamp < 5 * 60 * 1000) {
				return data;
			}
		}
	} catch (error) {
		console.warn("Failed to get cached transactions:", error);
	}
	return null;
};

const setCachedTransactions = async (
	address: Address,
	tokens: Token[],
	data: any,
) => {
	try {
		const cacheKey = getCacheKey(address, tokens);
		storage.set(
			cacheKey,
			JSON.stringify({
				data,
				timestamp: Date.now(),
			}),
		);
	} catch (error) {
		console.warn("Failed to cache transactions:", error);
	}
};

export const blockscoutApi = createApi({
	reducerPath: "blockscoutApi",
	baseQuery: fetchBaseQuery({ baseUrl: "https://api.etherscan.io/v2/api" }),
	tagTypes: ["Transactions"],
	endpoints: (builder) => ({
		getTokenTxs: builder.query({
			query: ({
				tokenId,
				address,
			}: {
				tokenId: TokenId;
				address: Address;
			}): FetchArgs => {
				const tokenAddress = getTokenById(tokenId).address;
				const chainId = tokenId.split("_")[1];
				if (!tokenAddress) {
					throw new Error("Problem fetching token transactions");
				}

				return {
					url: "https://api.etherscan.io/v2/api",
					params: {
						chainid: chainId,
						module: "account",
						action: "tokentx",
						contractaddress: tokenAddress,
						address: address,
						page: 1,
						offset: 10,
						startblock: 20000000,
						endblock: "latest",
						sort: "desc",
						apikey: apiKey,
					},
				};
			},
			transformResponse: (response, meta, arg) => ({
				...response,
				tokenId: arg.tokenId,
			}),
		}),

		getAllTokenTxs: builder.query({
			async queryFn(
				{ address, tokens },
				_queryApi,
				_extraOptions,
				fetchWithBQ,
			) {
				try {
					// First, try to get cached data
					const cachedData = await getCachedTransactions(address, tokens);

					// If we have cached data, return it immediately while fetching fresh data
					if (cachedData) {
						// Start background fetch for fresh data
						setTimeout(async () => {
							try {
								const freshData = await fetchFreshTransactions(
									address,
									tokens,
									fetchWithBQ,
								);
								if (
									freshData &&
									JSON.stringify(freshData) !== JSON.stringify(cachedData)
								) {
									await setCachedTransactions(address, tokens, freshData);
									// You could trigger a re-fetch here if needed
								}
							} catch (error) {
								console.warn("Background fetch failed:", error);
							}
						}, 0);

						return { data: cachedData };
					}

					// No cached data, fetch fresh data
					const freshData = await fetchFreshTransactions(
						address,
						tokens,
						fetchWithBQ,
					);

					// Cache the fresh data
					if (freshData) {
						await setCachedTransactions(address, tokens, freshData);
					}

					return { data: freshData };
				} catch (error) {
					return {
						data: {
							transactions: [],
							error: {
								status: "CUSTOM_ERROR",
								error: "Failed to fetch token transactions",
								data: error,
							},
						},
					};
				}
			},
			providesTags: ["Transactions"],
		}),
	}),
});

// Extract the fetching logic into a separate function
async function fetchFreshTransactions(
	address: Address,
	tokens: Token[],
	fetchWithBQ: any,
) {
	// Query for all tokens
	const queries = tokens.flatMap((token: Token) => {
		const chainId = token.chainId;
		const tokenAddress = token.address;
		const tokenSymbol = token.symbol;
		return {
			chainId,
			tokenAddress,
			tokenSymbol,
		};
	});

	const results = await throttle(
		queries.map(
			(query: { chainId: ChainId; tokenAddress: Address }) => () =>
				fetchWithBQ({
					url: "https://api.etherscan.io/v2/api",
					params: {
						chainid: query.chainId,
						module: "account",
						action: "tokentx",
						contractaddress: query.tokenAddress,
						address: address,
						page: 1,
						offset: 10,
						startblock: 20000000,
						endblock: "latest",
						sort: "desc",
						apikey: apiKey,
					},
				}),
		),
		4,
		1200,
	);

	// Combine successful results
	const combinedData = results.reduce(
		(acc, result, index) => {
			if (result.data?.result?.length) {
				acc.successful.push({
					...result.data,
					tokenId: `${queries[index].tokenSymbol}_${queries[index].chainId}`,
				});
			} else if (result.error) {
				acc.errors.push({
					tokenId: `${queries[index].tokenSymbol}_${queries[index].chainId}`,
					error: result.error,
				});
			}
			return acc;
		},
		{ successful: [], errors: [] } as {
			successful: any[];
			errors: Array<{
				tokenId: TokenId;
				error: any;
			}>;
		},
	);

	// Flatten all transactions into one array with proper null checks
	const allTransactions = combinedData.successful.flatMap((response) => {
		// Check if response and response.result exist and is an array
		if (response?.result && Array.isArray(response.result)) {
			return response.result.map((tx: any) => ({
				...tx,
				tokenId: response.tokenId,
			}));
		}
		return []; // Return empty array if no valid transactions
	});

	// Sort by block number (descending by default)
	allTransactions.sort((a, b) => {
		return Number(b.timeStamp) - Number(a.timeStamp);
	});

	return {
		transactions: allTransactions,
		errors: combinedData.errors,
	};
}

export const {
	useGetTokenTxsQuery,
	useGetAllTokenTxsQuery,
	useLazyGetAllTokenTxsQuery,
} = blockscoutApi;

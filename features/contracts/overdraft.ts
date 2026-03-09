import {
	type Address,
	type Hex,
	createPublicClient,
	formatEther,
	formatUnits,
	getContract,
	http,
	parseAbi,
	parseEther,
	parseUnits,
} from "viem";
import {
	type ChainId,
	type TokenId,
	getChainInfo,
	getTokenById,
	getTokensByChainId,
} from "../wallet";
import stableTokenAbi from "./abis/erc20.json";
import overdraftAbi from "./abis/overdraft.json";

type SubscribeUserParams = {
	account: any;
	initialLimit: {
		inUSD: string;
		inLocalCurreny: string;
	};
	chainId: ChainId;
	key?: string;
};

type OverdraftParams = {
	account: any;
	userAddress: Address;
	tokenId: TokenId;
	amount: string;
};

type TransferWithOverdraftParams = {
	account: any;
	//from: Address;
	to: Address;
	tokenId: TokenId;
	amount: string;
};

export async function subscribeToOverdraft(
	params: SubscribeUserParams,
): Promise<Hex> {
	//Run approvals

	const tokens = getTokensByChainId(params.chainId);
	const chain = getChainInfo(params.chainId);
	const overdraft = chain?.contracts?.overdraft;
	let txHash = "0x" as Hex;
	try {
		const approvalPromises = tokens.map((token) => {
			const approvalAmount = token.symbol.includes("USD")
				? (Number(params.initialLimit.inLocalCurreny) * 100).toString()
				: (Number(params.initialLimit.inLocalCurreny) * 100).toFixed(6);
			return params.account.writeContract({
				address: token.address,
				abi: parseAbi([
					"function approve(address spender, uint256 amount) public returns (bool)",
				]),
				functionName: "approve",
				args: [overdraft?.address, parseUnits(approvalAmount, token.decimals)],
			});
		});
		await Promise.all(approvalPromises);
		txHash = await params.account.writeContract({
			address: overdraft?.address,
			abi: overdraftAbi,
			functionName: "subscribeUser",
			args: [
				params.account.account.address,
				parseEther(params.initialLimit.inUSD),
				"CPODProd",
			],
		});
		return txHash;
	} catch (error) {
		console.error("Error in subscribing user:", error);
		return txHash;
	}
}

export async function getAvailableOverdraft({
	chainId,
	address,
}: { chainId: ChainId; address: Address }) {
	const chain = getChainInfo(chainId);
	const overdraft = chain.contracts?.overdraft;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: overdraft?.address,
		abi: overdraftAbi,
		client: publicClient,
	});
	const thisUser = await contract.read.getUser([address]);
	const availableOverdraft = thisUser.availableLimit;
	return formatEther(availableOverdraft);
}

export async function useOverdraft(params: OverdraftParams): Promise<Hex> {
	const token = getTokenById(params.tokenId);
	const chain = getChainInfo(token.chainId);
	const overdraft = chain?.contracts?.overdraft;
	const txHash = await params.account.writeContract({
		address: overdraft.address,
		abi: overdraftAbi,
		functionName: "useOverdraft",
		args: [
			params.userAddress,
			token.address,
			parseUnits(params.amount, token.decimals),
		],
	});
	return txHash;
}

export async function repayOverdraft(params: OverdraftParams): Promise<Hex> {
	const token = getTokenById(params.tokenId);
	const chain = getChainInfo(token.chainId);
	const overdraft = chain?.contracts?.overdraft;
	const txHash = await params.account.writeContract({
		address: overdraft.address,
		abi: overdraftAbi,
		functionName: "repayOverdraft",
		args: [
			params.userAddress,
			token.address,
			parseUnits(params.amount, token.decimals),
		],
	});
	return txHash;
}

export async function transferTokenWithOverdraft(
	params: TransferWithOverdraftParams,
) {
	let txHash = "0x";
	const token = getTokenById(params.tokenId);
	const chain = getChainInfo(token.chainId);
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const tokenContract = getContract({
		address: token.address,
		abi: stableTokenAbi,
		client: {
			public: publicClient,
			wallet: params.account,
		},
	});
	const balance = (await tokenContract.read.balanceOf([
		params.account.account.address,
	])) as bigint;
	const deficit = parseUnits(params.amount, token.decimals) - balance;
	try {
		await useOverdraft({
			account: params.account,
			userAddress: params.account.account.address,
			tokenId: params.tokenId,
			amount: formatUnits(deficit, token.decimals),
		});
	} catch (error) {
		console.log("Overdraft Request Failed", error);
	} finally {
		txHash = await tokenContract.write.transfer([
			params.to,
			parseUnits(params.amount, token.decimals),
		]);
	}
	return txHash;
}

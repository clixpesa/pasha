import { isSameAddress } from "@/utilities/addresses";
import {
	type Hex,
	createPublicClient,
	formatUnits,
	getContract,
	http,
	parseAbi,
	parseEther,
	parseUnits,
} from "viem";
import {
	type ChainId,
	type Token,
	getChainInfo,
	getTokensByChainId,
} from "../wallet";
//import stableTokenAbi from "./abis/erc20.json";
import goalSavingsAbi from "./abis/goal-savings.json";

type CreateGoalSavingsParams = {
	account: any;
	name: string;
	targetAmount: string;
	targetDate: number;
	chainId: ChainId;
	key?: string;
};

type GoalSavingDepositParams = {
	account: any;
	spaceId: string;
	amount: string;
	token: Token;
};

type GoalSavingWithdrawParams = {
	account: any;
	spaceId: string;
	amount: string;
	token: Token;
};

export type SpaceInfo = {
	spaceId: string;
	name: string;
	amount: number;
	yield: number;
	targetAmount: number;
	targetDate: number;
};

export async function createGoalSavings(
	params: CreateGoalSavingsParams,
): Promise<{ txHash: Hex; spaceId?: string }> {
	const alltokens = getTokensByChainId(params.chainId);
	const tokens = alltokens.filter((token) => token.symbol.includes("USD"));
	const chain = getChainInfo(params.chainId);
	const savings = chain?.contracts.goalSavings;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	let txHash = "0x" as Hex;
	try {
		const approvalPromises = tokens.map((token) => {
			return params.account.writeContract({
				address: token.address,
				abi: parseAbi([
					"function approve(address spender, uint256 amount) public returns (bool)",
				]),
				functionName: "approve",
				args: [
					savings?.address,
					parseUnits(params.targetAmount, token.decimals),
				],
			});
		});
		await Promise.all(approvalPromises);
		txHash = await params.account.writeContract({
			address: savings?.address,
			abi: goalSavingsAbi,
			functionName: "create",
			args: [params.name, parseEther(params.targetAmount), params.targetDate],
		});
		const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
		const logs = receipt.logs.filter((log) =>
			isSameAddress(log.address, savings?.address),
		);
		const spaceId = logs[0].topics[2]?.substring(0, 18);
		return { txHash, spaceId };
	} catch (error) {
		console.error("Error in subscribing user:", error);
		return { txHash, spaceId: undefined };
	}
}

export async function getGoalSavings({
	chainId,
	address,
}: { chainId: ChainId; address: Address }) {
	const chain = getChainInfo(chainId);
	const goalSavings = chain.contracts.goalSavings;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: goalSavings?.address,
		abi: goalSavingsAbi,
		client: publicClient,
	});
	const rawSavings = await contract.read.getUserSavings([address]);
	const userSavings: SpaceInfo[] = rawSavings.map((saving) => ({
		spaceId: saving.id,
		name: saving.name,
		targetAmount: Number(formatUnits(saving.target, 18)),
		targetDate: Number(saving.deadline),
		yield: Number(formatUnits(saving.yield, 18)),
		amount: Number(formatUnits(saving.amount, 18)),
	}));
	//console.log("User Savings:", userSavings.length);
	return userSavings;
}

export async function depositSavings(
	params: GoalSavingDepositParams,
): Promise<Hex> {
	const chain = getChainInfo(params.token.chainId);
	const savings = chain?.contracts.goalSavings;
	let txHash = "0x" as Hex;
	try {
		txHash = await params.account.writeContract({
			address: savings?.address,
			abi: goalSavingsAbi,
			functionName: "deposit",
			args: [
				params.spaceId,
				parseUnits(params.amount, params.token.decimals),
				params.token.address,
			],
		});
		return txHash;
	} catch (error) {
		console.error("Error depositing savings:", error);
		return txHash;
	}
}

export async function getSavings({
	chainId,
	spaceId,
}: { chainId: ChainId; spaceId: string }): Promise<SpaceInfo> {
	const chain = getChainInfo(chainId);
	const goalSavings = chain.contracts.goalSavings;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: goalSavings?.address,
		abi: goalSavingsAbi,
		client: publicClient,
	});
	const saving: any = await contract.read.getSavingsById([spaceId]);
	const userSavings = {
		spaceId: saving.id,
		name: saving.name,
		targetAmount: Number(formatUnits(saving.target, 18)),
		targetDate: Number(saving.deadline),
		yield: Number(formatUnits(saving.yield, 18)),
		amount: Number(formatUnits(saving.amount, 18)),
	} as SpaceInfo;
	//console.log("User Savings:", userSavings.length);
	return userSavings;
}

export async function withdrawSavings(
	params: GoalSavingWithdrawParams,
): Promise<Hex> {
	const chain = getChainInfo(params.token.chainId);
	const savings = chain?.contracts.goalSavings;
	let txHash = "0x" as Hex;
	try {
		txHash = await params.account.writeContract({
			address: savings?.address,
			abi: goalSavingsAbi,
			functionName: "withdraw",
			args: [params.spaceId, parseEther(params.amount)],
		});
		return txHash;
	} catch (error) {
		console.error("Error withdrawing savings:", error);
		return txHash;
	}
}

export async function editGoalSavings(
	params: CreateGoalSavingsParams,
): Promise<{ txHash: Hex; spaceId?: string }> {
	const chain = getChainInfo(params.chainId);
	const savings = chain?.contracts.goalSavings;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	let txHash = "0x" as Hex;
	try {
		txHash = await params.account.writeContract({
			address: savings?.address,
			abi: goalSavingsAbi,
			functionName: "edit",
			args: [
				params.key,
				params.name,
				parseEther(params.targetAmount),
				params.targetDate,
			],
		});
		const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
		const logs = receipt.logs.filter((log) =>
			isSameAddress(log.address, savings?.address),
		);
		const spaceId = logs[0].topics[2]?.substring(0, 18);
		return { txHash, spaceId };
	} catch (error) {
		console.error("Error in subscribing user:", error);
		return { txHash, spaceId: undefined };
	}
}

export async function closeGoalSavings(params: {
	account: any;
	spaceId: string;
	chainId: ChainId;
}): Promise<Hex> {
	const chain = getChainInfo(params.chainId);
	const savings = chain?.contracts.goalSavings;
	let txHash = "0x" as Hex;
	try {
		txHash = await params.account.writeContract({
			address: savings?.address,
			abi: goalSavingsAbi,
			functionName: "close",
			args: [params.spaceId],
		});
		return txHash;
	} catch (error) {
		console.error("Error closing goal savings:", error);
		return txHash;
	}
}

import { isSameAddress } from "@/utilities/addresses";
import {
	type Address,
	type Hex,
	createPublicClient,
	formatUnits,
	getContract,
	http,
	parseAbi,
	parseEther,
	parseUnits,
	zeroAddress,
} from "viem";
import {
	type ChainId,
	type Token,
	type TokenId,
	getChainInfo,
	getTokenById,
	getTokensByChainId,
} from "../wallet";
import roscasAbi from "./abis/roscas.json";

export type GroupSpaceInfo = {
	spaceId: string;
	name: string;
	admin: Address;
	token: Address;
	payoutAmount: number;
	interval: number;
	startDate: number;
	memberCount: number;
};

export type RoscaInfo = GroupSpaceInfo & {
	totalBalance: number;
	yield: number;
	loan: number;
};

export type RoscaSlot = {
	slotId: number;
	amount: number; // Amount in smallest unit (e.g., wei for ETH)
	payoutAmount: number; // Amount in smallest unit (e.g., wei for ETH)
	payoutDate: string; // Date in "MM/DD/YYYY" format
	owner: Address | null;
	paidOut: boolean; // Indicates if the slot has been paid out
};

export const frequencyOptions = [
	{
		name: "Weekly",
		frequency: "Weekly",
		desc: "Every 7 days",
		interval: 604800,
	},
	{
		name: "every 2 Weeks",
		frequency: "2 Weeks",
		desc: "Every 14 days",
		interval: 1209600,
	},
	{
		name: "every 3 Weeks",
		frequency: "3 Weeks",
		desc: "Every 21 days",
		interval: 1814400,
	},
	{
		name: "Monthly",
		frequency: "Monthly",
		desc: "Every 28 days",
		interval: 2419200,
	},
	{
		name: "every 2 Months",
		frequency: "2 Months",
		desc: "Every 56 days",
		interval: 4838400,
	},
];

type CreateRoscaParams = {
	account: any;
	name: string;
	tokenId: TokenId;
	payoutAmount: string;
	interval: number;
	memberCount: number;
	startDate: number;
	key?: string;
};

export async function createRosca(
	params: CreateRoscaParams,
): Promise<{ txHash: Hex; spaceId?: string }> {
	const token = getTokenById(params.tokenId);
	const tokens = getTokensByChainId(token.chainId);
	const chain = getChainInfo(token.chainId);
	const rosca = chain?.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	let txHash = "0x" as Hex;
	try {
		txHash = await params.account.writeContract({
			address: rosca?.address,
			abi: roscasAbi,
			functionName: "createRosca",
			args: [
				params.name,
				token.address,
				[
					parseEther(params.payoutAmount),
					params.memberCount,
					params.interval,
					params.startDate,
				],
			],
		});
		const approvalPromises = tokens.map((token) => {
			const approvalAmount = (Number(params.payoutAmount) * 10).toFixed(6);
			return params.account.writeContract({
				address: token.address,
				abi: parseAbi([
					"function approve(address spender, uint256 amount) public returns (bool)",
				]),
				functionName: "approve",
				args: [rosca?.address, parseUnits(approvalAmount, token.decimals)],
			});
		});
		await Promise.all(approvalPromises);

		const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
		const logs = receipt.logs.filter((log) =>
			isSameAddress(log.address, rosca?.address),
		);
		const spaceId = logs[0].topics[2]?.substring(0, 18);
		return { txHash, spaceId };
	} catch (error) {
		console.error("Error creating rosca:", error);
		return { txHash, spaceId: undefined };
	}
}

export async function getRosca({
	chainId,
	spaceId,
}: { chainId: ChainId; spaceId: string }): Promise<RoscaInfo> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: roscaContrant?.address,
		abi: roscasAbi,
		client: publicClient,
	});
	try {
		const rosca: any[] = await contract.read.roscas([spaceId]);
		const userRosca = {
			spaceId: rosca[0],
			name: rosca[1],
			admin: rosca[2],
			token: rosca[3],
			totalBalance: Number(formatUnits(rosca[4], 18)),
			yield: Number(formatUnits(rosca[5], 18)),
			loan: Number(formatUnits(rosca[6], 18)),
			payoutAmount: Number(formatUnits(rosca[7].payoutAmount, 18)),
			interval: Number(rosca[7].interaval),
			startDate: Number(rosca[7].startDate),
			memberCount: Number(rosca[7].memberCount),
		} as RoscaInfo;

		return userRosca;
	} catch (error) {
		console.error("Error fetching rosca:", error);
		return {} as RoscaInfo;
	}
}

export async function isUserSlotted({
	chainId,
	spaceId,
	userAddress,
}: {
	chainId: ChainId;
	spaceId: string;
	userAddress: Address;
}): Promise<{ isSlotted: boolean; freeSlots: number }> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: roscaContrant?.address,
		abi: roscasAbi,
		client: publicClient,
	});

	const slot: any[] = await contract.read.userSlot([userAddress, spaceId]);
	const roscaSlots: any[] = await contract.read.getRoscaSlots([spaceId]);
	const freeSlots = roscaSlots.filter((slot) =>
		isSameAddress(slot.owner, zeroAddress),
	);
	return {
		isSlotted: isSameAddress(slot[4], userAddress),
		freeSlots: freeSlots.length,
	};
}

export async function getUserRoscas({
	chainId,
	address,
}: { chainId: ChainId; address: Address }): Promise<RoscaInfo[]> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: roscaContrant?.address,
		abi: roscasAbi,
		client: publicClient,
	});
	const rawRoscas: any[] = await contract.read.getUserRoscas([address]);
	const userRoscas: RoscaInfo[] = rawRoscas.map((rosca) => ({
		spaceId: rosca.id,
		name: rosca.name,
		admin: rosca.admin,
		token: rosca.token,
		totalBalance: Number(formatUnits(rosca.totalBalance, 18)),
		yield: Number(formatUnits(rosca.yield, 18)),
		loan: Number(formatUnits(rosca.loan, 18)),
		payoutAmount: Number(formatUnits(rosca.slotInfo.payoutAmount, 18)),
		interval: Number(rosca.slotInfo.interaval),
		startDate: Number(rosca.slotInfo.startDate),
		memberCount: Number(rosca.slotInfo.memberCount),
	}));
	return userRoscas;
}

export async function getRoscaSlots({
	chainId,
	spaceId,
}: { chainId: ChainId; spaceId: string }): Promise<RoscaSlot[]> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: roscaContrant?.address,
		abi: roscasAbi,
		client: publicClient,
	});
	try {
		const slots: any[] = await contract.read.getRoscaSlots([spaceId]);
		return slots.map((slot) => ({
			slotId: slot.id,
			amount: Number(formatUnits(slot.amount, 18)),
			payoutAmount: Number(formatUnits(slot.payoutAmount, 18)),
			payoutDate: new Date(Number(slot.payoutDate) * 1000).toLocaleDateString(
				"en-US",
				{
					day: "numeric",
					month: "short",
				},
			),
			owner: isSameAddress(slot.owner, zeroAddress) ? null : slot.owner,
			paidOut: slot.paidOut,
		}));
	} catch (error) {
		console.error("Error fetching rosca slots:", error);
		return [];
	}
}

type RoscaSelectParams = {
	account: any;
	chainId: ChainId;
	spaceId: string;
	slotId: number;
};

export async function selectRoscaSlot(params: RoscaSelectParams): Promise<Hex> {
	const chain = getChainInfo(params.chainId);
	const roscaContrant = chain.contracts.roscas;
	let txHash = "0x" as Hex;
	try {
		txHash = await params.account.writeContract({
			address: roscaContrant?.address,
			abi: roscasAbi,
			functionName: "selectSlot",
			args: [params.spaceId, params.slotId],
		});
		return txHash;
	} catch (error) {
		console.error("Error selecting rosca slot:", error);
		return txHash;
	}
}

export async function changeRoscaSlot(params: RoscaSelectParams): Promise<Hex> {
	const chain = getChainInfo(params.chainId);
	const roscaContrant = chain.contracts.roscas;
	let txHash = "0x" as Hex;
	try {
		txHash = await params.account.writeContract({
			address: roscaContrant?.address,
			abi: roscasAbi,
			functionName: "changeSlot",
			args: [params.spaceId, params.slotId],
		});
		console.log(txHash, params.spaceId, params.slotId);
		return txHash;
	} catch (error) {
		console.error("Error changing rosca slot:", error);
		return txHash;
	}
}

export async function getActiveRoscaSlots({
	chainId,
	spaceId,
}: {
	chainId: ChainId;
	spaceId: string;
}): Promise<RoscaSlot[]> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: roscaContrant?.address,
		abi: roscasAbi,
		client: publicClient,
	});
	try {
		const activeSlot: any[] = await contract.read.activeSlot([spaceId]);
		const defaultedSlot: any[] = await contract.read.defaultedSlot([spaceId]);
		return [activeSlot, defaultedSlot].map((slot) => ({
			slotId: slot[0],
			amount: Number(formatUnits(slot[1], 18)),
			payoutAmount: Number(formatUnits(slot[2], 18)),
			payoutDate: new Date(Number(slot[3]) * 1000).toLocaleDateString("en-US", {
				weekday: "short",
				day: "numeric",
				month: "short",
			}),
			owner: isSameAddress(slot[4], zeroAddress) ? null : slot[4],
			paidOut: slot[5],
		}));
	} catch (error) {
		console.error("Error fetching active rosca slots:", error);
		return [];
	}
}

type SlotDepositParams = {
	account: any;
	spaceId: string;
	amount: string;
	isDefaulted: boolean;
	token: Token;
};

export async function fundRoscaSlot(params: SlotDepositParams): Promise<Hex> {
	const chain = getChainInfo(params.token.chainId);
	const roscaContrant = chain.contracts.roscas;
	let txHash = "0x" as Hex;
	try {
		txHash = await params.account.writeContract({
			address: roscaContrant?.address,
			abi: roscasAbi,
			functionName: "fundSlot",
			args: [
				params.spaceId,
				parseUnits(params.amount, params.token.decimals),
				params.isDefaulted,
			],
		});
		return txHash;
	} catch (error) {
		console.error("Error funding rosca slot:", error);
		return txHash;
	}
}

type SlotWithdralParams = {
	account: any;
	spaceId: string;
	chainId: ChainId;
};

export async function withdrawRoscaSlot(
	params: SlotWithdralParams,
): Promise<Hex> {
	const chain = getChainInfo(params.chainId);
	const roscaContrant = chain.contracts.roscas;
	let txHash = "0x" as Hex;
	try {
		txHash = await params.account.writeContract({
			address: roscaContrant?.address,
			abi: roscasAbi,
			functionName: "withdrawSlot",
			args: [params.spaceId],
		});
		return txHash;
	} catch (error) {
		console.error("Error withdrawing rosca slot:", error);
		return txHash;
	}
}

export async function getRoscaMembers({
	chainId,
	spaceId,
}: {
	chainId: ChainId;
	spaceId: string;
}): Promise<Address[]> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: roscaContrant?.address,
		abi: roscasAbi,
		client: publicClient,
	});
	try {
		const members: Address[] = await contract.read.getRoscaMembers([spaceId]);
		return members;
	} catch (error) {
		console.error("Error fetching rosca members:", error);
		return [];
	}
}

export async function getAllRoscas(
	chainId: ChainId,
): Promise<GroupSpaceInfo[]> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	const contract = getContract({
		address: roscaContrant?.address,
		abi: roscasAbi,
		client: publicClient,
	});
	try {
		const allRoscas: any[] = await contract.read.getAllRoscas();
		return allRoscas.map((rosca) => ({
			spaceId: rosca.id,
			name: rosca.name,
			admin: rosca.admin,
			token: rosca.token,
			payoutAmount: Number(formatUnits(rosca.slotInfo.payoutAmount, 18)),
			interval: Number(rosca.slotInfo.interaval),
			startDate: Number(rosca.slotInfo.startDate),
			memberCount: Number(rosca.slotInfo.memberCount),
		}));
	} catch (error) {
		console.error("Error fetching all roscas:", error);
		return [];
	}
}

export async function joinRosca({
	chainId,
	spaceId,
	account,
}: {
	chainId: ChainId;
	spaceId: string;
	account: any;
}): Promise<{ txHash: Hex; _spaceId?: string }> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	let txHash = "0x" as Hex;
	try {
		txHash = await account.writeContract({
			address: roscaContrant?.address,
			abi: roscasAbi,
			functionName: "joinRosca",
			args: [spaceId],
		});
		const receipt = await publicClient.getTransactionReceipt({
			hash: txHash,
		});
		const logs = receipt.logs.filter((log) =>
			isSameAddress(log.address, roscaContrant?.address),
		);
		const _spaceId = logs[0].topics[2]?.substring(0, 18);
		return { txHash, _spaceId };
	} catch (error) {
		console.error("Error joining rosca:", error);
		return { txHash };
	}
}

export async function addMember({
	chainId,
	spaceId,
	account,
	member,
}: {
	chainId: ChainId;
	spaceId: string;
	account: any;
	member: Address;
}): Promise<{ txHash: Hex }> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	const publicClient = createPublicClient({
		chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});
	let txHash = "0x" as Hex;
	try {
		txHash = await account.writeContract({
			address: roscaContrant?.address,
			abi: roscasAbi,
			functionName: "addMember",
			args: [spaceId, member],
		});
		/*
			const receipt = await publicClient.getTransactionReceipt({
				hash: txHash,
			});
			const logs = receipt.logs.filter((log) =>
				isSameAddress(log.address, roscaContrant?.address),
			);
			const _spaceId = logs[0].topics[2]?.substring(0, 18);
		*/

		return { txHash };
	} catch (error) {
		console.error("Error joining rosca:", error);
		return { txHash };
	}
}

export async function editRosca({
	account,
	chainId,
	spaceId,
	name,
}: {
	account: any;
	chainId: ChainId;
	spaceId: string;
	name: string;
}): Promise<Hex> {
	const chain = getChainInfo(chainId);
	const roscaContrant = chain.contracts.roscas;
	let txHash = "0x" as Hex;
	try {
		txHash = await account.writeContract({
			address: roscaContrant?.address,
			abi: roscasAbi,
			functionName: "editRosca",
			args: [spaceId, name],
		});
		return txHash;
	} catch (error) {
		console.error("Error editing rosca:", error);
		return txHash;
	}
}

import { type Address, parseUnits } from "viem";
import type { Token } from "../wallet";
import stableTokenAbi from "./abis/erc20.json";

type TransferParams = {
	account: any; //SmartAccountClient | WalletClient;
	recipient: Address;
	token: Token;
	amount: string;
};

export async function transferFunds(params: TransferParams) {
	const txHash = await params.account.writeContract({
		address: params.token.address as Address,
		abi: stableTokenAbi,
		functionName: "transfer",
		args: [params.recipient, parseUnits(params.amount, params.token.decimals)],
	});
	return txHash;
}

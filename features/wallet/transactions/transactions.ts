import { isSameAddress } from "@/utilities/addresses";
import { formatUnits, parseUnits } from "viem";
import type { Address, RawTransaction } from "../types";

export function getAllTokenTxs(
	transactions: RawTransaction[],
	address: Address,
	rate: any,
) {
	if (!transactions && !transactions?.length) {
		return [];
	}

	const filteredTxs = transactions.filter(
		(tx) =>
			tx?.value &&
			Number(tx.value) > parseUnits("0.0025", Number(tx.tokenDecimal)),
	);
	const thisTxs = filteredTxs.flatMap((tx) => {
		if (!tx.timeStamp || !tx.value) return null;
		const txDate = new Date(Number(tx.timeStamp) * 1000);
		const date = txDate.toDateString().split(" ");
		const amount = formatUnits(tx.value.toString(), Number(tx.tokenDecimal));
		const convRate = isSameAddress(tx.to, address)
			? rate.buying_rate
			: rate.selling_rate;
		return {
			id: `${tx.hash.slice(0, 10)}_${tx.timeStamp}`,
			hash: tx.hash,
			title: isSameAddress(tx.to, address)
				? `Received ${tx.tokenSymbol}`
				: `Transfered ${tx.tokenSymbol}`,
			date: `${date[0]}, ${date[2]} ${date[1]}, ${txDate.toTimeString().slice(0, 5)}`,
			tokenId: tx.tokenId,
			to: tx.to,
			from: tx.from,
			fee: formatUnits(tx.gasUsed.toString(), Number(tx.tokenDecimal)),
			amount: Number(amount),
			amountUSD:
				tx.tokenSymbol.includes("SH") || tx.tokenSymbol.includes("KES")
					? Number(amount) / convRate //rates.KES.conversionRate
					: Number(amount),
			timestamp: txDate.getTime(),
		};
	});

	thisTxs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
	return thisTxs;
}

import { TokenLogo } from "@/components/logos/TokenLogo";
import { Text, TouchableArea, XStack, YStack } from "@/ui";
import { getRate } from "../../features/wallet/rates";
import type { ChainId, Currency } from "../../features/wallet/types";

export type TxItemParams = {
	tokenInfo: {
		name: string;
		symbol: string;
		logoUrl: string;
		chainId: ChainId;
	};
	amount: {
		actual: number;
		inUSD: number;
	};
	txInfo: {
		title: string;
		date: string;
		credited?: boolean;
	};
	hideNetworkLogo?: boolean;
	currency: Currency;
};

export function TransactionItem({
	txInfo,
	tokenInfo,
	amount,
	hideNetworkLogo,
	currency,
}: TxItemParams): JSX.Element {
	const rate = getRate(currency);
	const eqvAmount = rate?.conversionRate
		? amount.inUSD * rate.conversionRate
		: 0;
	return (
		<TouchableArea onPress={() => console.log(tokenInfo)}>
			<XStack items="center" justify="space-between" my="$2xs">
				<XStack gap="$sm">
					<TokenLogo
						chainId={tokenInfo.chainId}
						symbol={tokenInfo.symbol}
						url={tokenInfo.logoUrl}
						hideNetworkLogo={hideNetworkLogo}
					/>
					<YStack gap="$2xs">
						<Text variant="subHeading2">{txInfo.title}</Text>
						<Text variant="body3" color="$neutral2">
							{txInfo.date}
						</Text>
					</YStack>
				</XStack>
				<YStack px="$2xs" gap="$2xs">
					<Text variant="subHeading2" text="right">
						{`${txInfo.title.includes("Rece") || txInfo.title.includes("Add") ? "+" : "-"}${amount.actual.toFixed(2)}`}
					</Text>
					<Text variant="body3" color="$neutral2" text="right">
						~{`${eqvAmount.toFixed(2)} ${currency}`}
					</Text>
				</YStack>
			</XStack>
		</TouchableArea>
	);
}

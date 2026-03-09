import { TokenLogo } from "@/components/logos/TokenLogo";
import { Text, XStack, YStack } from "@/ui";
import { getRate } from "../../features/wallet/rates";
import { type ChainId, Currency } from "../../features/wallet/types";

export type TokenItemParams = {
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
	hideNetworkLogo?: boolean;
};

export function TokenItem({
	tokenInfo,
	amount,
	hideNetworkLogo,
}: TokenItemParams): JSX.Element {
	const rate = getRate(Currency.KES);
	const eqvAmount = rate?.conversionRate
		? amount.inUSD * rate.conversionRate
		: 0;
	return (
		<XStack items="center" justify="space-between">
			<XStack gap="$sm">
				<TokenLogo
					chainId={tokenInfo.chainId}
					symbol={tokenInfo.symbol}
					url={tokenInfo.logoUrl}
					hideNetworkLogo={hideNetworkLogo}
				/>
				<YStack gap="$2xs">
					<Text variant="subHeading2">{tokenInfo.symbol}</Text>
					<Text variant="body3" color="$neutral2">
						{tokenInfo.name}
					</Text>
				</YStack>
			</XStack>
			<YStack px="$2xs" gap="$2xs">
				<Text variant="subHeading2" text="right">
					{amount.actual < 0.005 ? "0.00" : amount.actual.toFixed(2)}
				</Text>
				<Text variant="body3" color="$neutral2" text="right">
					~{`${rate?.symbol} ${eqvAmount.toFixed(2)}`}
				</Text>
			</YStack>
		</XStack>
	);
}

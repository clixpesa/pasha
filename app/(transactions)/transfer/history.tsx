import { Screen } from "@/components/layout/Screen";
import { TransactionItem } from "@/components/lists/TransactionItem";
import { useAppState } from "@/features/essentials/appState";
import { getTokenById, useGetRateQuery } from "@/features/wallet";
import { useEnabledTokens } from "@/features/wallet/hooks";
import { useGetAllTokenTxsQuery } from "@/features/wallet/transactions/blockscout";
import { getAllTokenTxs } from "@/features/wallet/transactions/transactions";
import { useWalletState } from "@/features/wallet/walletState";
import {
	ScrollView,
	Stack,
	Text,
	TransactionLoader,
	XStack,
	YStack,
} from "@/ui";
import { NoTransactions, Refresh } from "@/ui/components/icons";
import { memo, useMemo, useState } from "react";
import { RefreshControl } from "react-native";

const MemoizedTransactionItem = memo(TransactionItem);

export default function TxHistoryScreen() {
	const tokens = useEnabledTokens();
	const mainAddress = useAppState((s) => s.user.mainAddress);
	const currency = useWalletState((s) => s.currency);
	const [refreshing, setRefreshing] = useState(false);
	const { data: ratesData } = useGetRateQuery(currency);
	const {
		data,
		error,
		isLoading: txLoading,
		refetch,
	} = useGetAllTokenTxsQuery({
		address: mainAddress,
		tokens: tokens,
		// Consider adding refetchOnMountOrArgChange: false if appropriate
	});

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setTimeout(() => setRefreshing(false), 2000);
	};

	// Memoize transactions to prevent recalculations
	const transactions = useMemo(
		() => getAllTokenTxs(data?.transactions, mainAddress, ratesData),
		[data?.transactions, mainAddress, ratesData],
	);

	const isLoading = txLoading || !data;

	return (
		<Screen
			title="All Transactions"
			rightElement={{
				Icon: <Refresh size={24} color="$neutral2" />,
				onPress: onRefresh,
			}}
		>
			<ScrollView
				width="100%"
				grow={1}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					items: "center",
					pb: "$3xl",
				}}
			>
				<YStack
					bg="$surface1"
					px="$md"
					width="95%"
					py={isLoading ? "$2xs" : "$md"}
					mt={transactions.length > 0 ? "$md" : "$3xl"}
					rounded="$lg"
					gap="$md"
				>
					{isLoading ? (
						<TransactionLoader opacity={1} withAmounts />
					) : transactions.length ? (
						transactions.map((item) => {
							const token = getTokenById(item.tokenId);
							return item ? (
								<MemoizedTransactionItem
									key={`${item.id}_${item.tokenId}`}
									txInfo={{
										title: item.title,
										date: item.date,
									}}
									tokenInfo={{
										name: token.name,
										symbol: token.symbol,
										logoUrl: token.logo,
										chainId: token.chainId,
									}}
									amount={{
										actual: item.amount,
										inUSD: item.amountUSD,
									}}
									currency={currency}
								/>
							) : null;
						})
					) : (
						<NoTransactionsView />
					)}
				</YStack>
			</ScrollView>
		</Screen>
	);
}

const NoTransactionsView = memo(() => (
	<XStack items="center" gap="$sm">
		<Stack
			bg="$neutral3"
			height={48}
			rounded="$full"
			width={48}
			items="center"
			justify="center"
		>
			<NoTransactions size={32} color="$surface1" />
		</Stack>
		<Text variant="subHeading1" color="$neutral2">
			No transactions yet
		</Text>
	</XStack>
));

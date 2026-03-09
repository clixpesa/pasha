import { TransactionItem } from "@/components/lists/TransactionItem";
import { getTokenById, useGetRateQuery } from "@/features/wallet";
import { useEnabledTokens } from "@/features/wallet/hooks";
import { useGetAllTokenTxsQuery } from "@/features/wallet/transactions/blockscout";
import { getAllTokenTxs } from "@/features/wallet/transactions/transactions";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Stack,
	Text,
	TouchableArea,
	TransactionLoader,
	XStack,
	YStack,
} from "@/ui";
import { NoTransactions } from "@/ui/components/icons";
import { router } from "expo-router";
import {
	forwardRef,
	memo,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from "react";
import { useAppState } from "../appState";

const MemoizedTransactionItem = memo(TransactionItem);

export interface TransactionsCardRef {
	refetch: () => void;
}

export const TransactionsCard = memo(
	forwardRef<TransactionsCardRef>((props, ref) => {
		const tokens = useEnabledTokens();
		const mainAddress = useAppState((s) => s.user.mainAddress);
		const currency = useWalletState((s) => s.currency);
		const [isRefreshing, setIsRefreshing] = useState(false);

		const { data: ratesData } = useGetRateQuery(currency);

		const {
			data,
			error,
			isLoading: txLoading,
			isFetching,
			refetch,
		} = useGetAllTokenTxsQuery({
			address: mainAddress,
			tokens: tokens,
			//refetchOnMountOrArgChange: true,
		});

		// Expose refetch function through ref
		useImperativeHandle(ref, () => ({ refetch }), [refetch]);

		// Memoize transactions to prevent recalculations
		const transactions = useMemo(
			() => getAllTokenTxs(data?.transactions, mainAddress, ratesData),
			[data?.transactions, mainAddress, ratesData],
		);

		// Memoize the first two transactions
		const displayedTransactions = useMemo(
			() => transactions.slice(0, 2),
			[transactions],
		);

		// Handle refresh state
		useEffect(() => {
			if (isFetching && transactions.length > 0) {
				setIsRefreshing(true);
			} else {
				setIsRefreshing(false);
			}
		}, [isFetching, transactions.length]);

		// Only show initial loading if we have no data at all
		const isInitialLoading = txLoading && !data;

		return (
			<YStack
				bg="$surface1"
				width="100%"
				px="$md"
				py={isInitialLoading ? "$2xs" : "$md"}
				mt={transactions.length > 0 ? "$md" : "$3xl"}
				rounded="$lg"
				gap="$md"
			>
				{/* Show refresh indicator if we have data but are fetching new data */}
				{isRefreshing && transactions.length > 0 && (
					<XStack items="center" justify="center" py="$xs">
						<TransactionLoader opacity={0.6} height={20} />
					</XStack>
				)}

				{isInitialLoading ? (
					<TransactionLoader opacity={1} withAmounts />
				) : displayedTransactions.length ? (
					displayedTransactions.map((item) => {
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

				{!isInitialLoading && transactions.length > 0 && <SeeAllButton />}
			</YStack>
		);
	}),
);

// Extracted components to prevent recreation on parent render
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

const SeeAllButton = memo(() => (
	<TouchableArea
		self="center"
		px="$3xl"
		hitSlop={8}
		pt="$2xs"
		onPress={() => router.navigate("/transfer/history")}
	>
		<Text variant="subHeading2" color="$neutral2">
			See all
		</Text>
	</TouchableArea>
));

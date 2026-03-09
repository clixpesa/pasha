import {
	HomeCard,
	HomeHeader,
	ProductsCard,
	TransactionsCard,
	type TransactionsCardRef,
} from "@/features/essentials";
import { useAppState } from "@/features/essentials/appState";
import {
	Currency,
	ratesApi,
	useGetRateQuery,
	usePublicClient,
	useWalletContext,
} from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import { useWalletState } from "@/features/wallet/walletState";
import { LinearGradient, ScrollView, View, YStack } from "@/ui";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl } from "react-native";
import { useDispatch } from "react-redux";
//import { Button } from "tamagui";

export default function HomeScreen() {
	const [refreshing, setRefreshing] = useState(false);
	const dispatch = useDispatch();
	const user = useAppState((s) => s.user);
	const isTestnet = useAppState((s) => s.testnetEnabled);
	const { defaultChainId } = useEnabledChains();
	const { mainAccount } = useWalletContext();
	const publicClient = usePublicClient();
	const fetchBalances = useWalletState((s) => s.fetchBalances);
	const currency = useWalletState((s) => s.currency);
	const transactionsRef = useRef<TransactionsCardRef>(null);
	const { data: ratesData, isSuccess } = useGetRateQuery(currency);

	// Refetch transactions when screen comes into focus
	useFocusEffect(
		useCallback(() => {
			// Only refetch if we have cached data (avoid unnecessary loading on first visit)
			if (transactionsRef.current) {
				transactionsRef.current.refetch();
			}
		}, []),
	);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			// Refresh balances
			if (user.mainAddress) {
				await fetchBalances(
					user.mainAddress,
					defaultChainId,
					isTestnet,
					ratesData?.selling_rate,
				);
			}
			// Refetch transactions
			if (transactionsRef.current) {
				transactionsRef.current.refetch();
			}
		} finally {
			setTimeout(() => setRefreshing(false), 1000);
		}
	};

	const handleTestFns = async () => {
		try {
			console.log("Good robot");
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (user.mainAddress && isSuccess)
			fetchBalances(
				user.mainAddress,
				defaultChainId,
				isTestnet,
				ratesData?.selling_rate,
			);
	}, [user, fetchBalances, defaultChainId, isTestnet, ratesData]);

	useEffect(() => {
		dispatch(ratesApi.endpoints.getRate.initiate(Currency.KES));
	}, [dispatch]);

	return (
		<View flex={1} items="center" bg="$surface1">
			<LinearGradient
				width="100%"
				height="100%"
				colors={["$surface1", "$surface3"]}
				position="absolute"
			/>

			<HomeHeader />
			<ScrollView
				width="100%"
				grow={1}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="$neutral2"
					/>
				}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					items: "center",
					pb: "$3xl",
				}}
			>
				<HomeCard />
				<YStack gap="$sm" width="92%">
					<TransactionsCard ref={transactionsRef} />
					<ProductsCard />

					{/*<Button height="$3xl" onPress={handleTestFns}>
						Test func
					</Button>*/}
				</YStack>
			</ScrollView>
		</View>
	);
}

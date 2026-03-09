import { Screen } from "@/components/layout/Screen";
import { type GroupSpaceInfo, getAllRoscas } from "@/features/contracts/roscas";
import { getRate, getTokensByChainId } from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import { useWalletState } from "@/features/wallet/walletState";
import {
	Input,
	Loader,
	ScrollView,
	Stack,
	Text,
	TouchableArea,
	Unicon,
	UniversalImage,
	UniversalImageResizeMode,
	View,
	XStack,
	YStack,
} from "@/ui";
import { Search, X } from "@/ui/components/icons";
import { isSameAddress } from "@/utilities/addresses";
import { useMemoCompare } from "@/utilities/react/hooks";
import { useDebounce } from "@/utilities/time/timing";
import { router } from "expo-router";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function JoinGroup() {
	const inputRef = useRef<Input>(null);
	const [searchText, setSearchText] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { defaultChainId } = useEnabledChains();
	const tokens = getTokensByChainId(defaultChainId);
	const currency = useWalletState((s) => s.currency);
	const { symbol, conversionRate } = getRate(currency);
	const [allGroups, setAllGroups] = useState<GroupSpaceInfo[]>([]);
	const { groups, searchTerm, loading } = useGroupSearch(searchText, allGroups);

	const handleTextChange = (text: string) => {
		setSearchText(text);
		setTimeout(() => {
			inputRef.current?.setNativeProps({
				contentOffset: { x: Number.MAX_SAFE_INTEGER, y: 0 },
			});
		}, 50);
	};
	useEffect(() => {
		setIsLoading(true);
		const getSpaces = async () => {
			const roscas = await getAllRoscas(defaultChainId);
			if (roscas.length) setAllGroups([...pGroups, ...roscas]);
			setIsLoading(false);
		};
		getSpaces();
	}, [defaultChainId]);
	return (
		<Screen title="Join a Group">
			<YStack gap="$sm" width="92%">
				<XStack
					borderWidth={2}
					borderColor="$surface3"
					rounded="$vl"
					items="center"
					px="$sm"
					gap="$vs"
					mb="$2xs"
				>
					<Search size={24} color="$neutral2" />
					<Input
						ref={inputRef}
						fontSize="$lg"
						autoCapitalize="none"
						autoCorrect={false}
						px={1}
						placeholder="search group"
						height="$5xl"
						value={searchText}
						textContentType="none"
						//text={searchText.length > 23 ? "right" : "left"}
						maxW="81%"
						multiline={false}
						onContentSizeChange={() => {
							setTimeout(() => {
								inputRef.current?.setNativeProps({
									contentOffset: { x: Number.MAX_SAFE_INTEGER, y: 0 },
								});
							}, 50);
						}}
						grow={1}
						onChangeText={handleTextChange}
					/>
					{searchText.length > 3 ? (
						<TouchableArea onPress={() => setSearchText("")} hitSlop={10}>
							<X size={24} color="$neutral2" />
						</TouchableArea>
					) : null}
				</XStack>
				{loading || searchTerm !== searchText ? (
					<Stack px="$sm" bg="$surface1" rounded="$lg">
						<Loader.SearchResult />
					</Stack>
				) : !groups.length && searchText.length ? (
					<Stack items="center" px="$sm" py="$md" bg="$surface1" rounded="$lg">
						<Text variant="buttonLabel2">No results found</Text>
						<Text color="$neutral3" text="center" variant="body2">
							The group you searched does not exist or is spelled incorrectly.
						</Text>
					</Stack>
				) : (
					<ScrollView showsVerticalScrollIndicator={false}>
						<View
							flexDirection="row"
							flexWrap="wrap"
							gap="$md"
							mt="$md"
							mb="35%"
							justify="space-evenly"
							self="center"
							width="100%"
						>
							{groups.length
								? groups.map((group) => {
										const spaceToken = tokens.find((token) =>
											isSameAddress(token.address, group.token),
										);
										const isUSD = spaceToken?.symbol.includes("USD");
										const endTime =
											group.startDate +
											group.interval * (group.memberCount - 1);
										const date: Date = new Date(endTime * 1000);
										return (
											<YStack
												key={group.spaceId}
												bg="$surface1"
												width="46%"
												p="$sm"
												gap="$vs"
												rounded="$md"
												borderWidth={1}
												borderColor="$surface3"
												onPress={() => {
													router.navigate({
														pathname: "/(spaces)/roscas/rosca-overview",
														params: {
															...group,
															type: "rosca",
															real: group.spaceId.length > 6 ? "true" : "false",
														},
													});
												}}
											>
												<XStack self="flex-end" px="$md">
													<UniversalImage
														style={{ image: { borderRadius: 42 } }}
														fallback={
															<Unicon address={group.admin} size={42} />
														}
														size={{
															width: 42,
															height: 42,
															resizeMode: UniversalImageResizeMode.Cover,
														}}
														uri={""}
													/>
													<Stack
														ml={-8}
														rounded="$full"
														bg="$neutral3"
														width={42}
														justify="center"
														items="center"
													>
														<Text color="$surface1" variant="body3">
															+{group.memberCount - 1}
														</Text>
													</Stack>
												</XStack>
												<YStack gap="$3xs">
													<Text variant="subHeading2" color="$neutral1">
														{group.name}
													</Text>
													<Text variant="body3" color="$neutral2">
														{group.memberCount} members
													</Text>
												</YStack>
												<Stack>
													<Text variant="subHeading2" color="$accent1">
														{isUSD ? "$" : symbol}
														{group.payoutAmount.toFixed(0)}
													</Text>
													<Text variant="body4" color="$neutral2">
														Ends on{" "}
														{date.toLocaleDateString("en-US", {
															day: "numeric",
															month: "short",
															year: "numeric",
														})}
													</Text>
												</Stack>
											</YStack>
										);
									})
								: allGroups.map((group) => {
										const spaceToken = tokens.find((token) =>
											isSameAddress(token.address, group.token),
										);
										const isUSD = spaceToken?.symbol.includes("USD");
										const endTime =
											group.startDate +
											group.interval * (group.memberCount - 1);
										const date: Date = new Date(endTime * 1000);
										return (
											<YStack
												key={group.spaceId}
												bg="$surface1"
												width="46%"
												p="$sm"
												gap="$vs"
												rounded="$md"
												borderWidth={1}
												borderColor="$surface3"
												onPress={() => {
													router.navigate({
														pathname: "/(spaces)/roscas/rosca-overview",
														params: {
															...group,
															type: "rosca",
															real: group.spaceId.length > 6 ? "true" : "false",
														},
													});
												}}
											>
												<XStack self="flex-end" px="$md">
													<UniversalImage
														style={{ image: { borderRadius: 42 } }}
														fallback={
															<Unicon address={group.admin} size={42} />
														}
														size={{
															width: 42,
															height: 42,
															resizeMode: UniversalImageResizeMode.Cover,
														}}
														uri={""}
													/>
													<Stack
														ml={-8}
														rounded="$full"
														bg="$neutral3"
														width={42}
														justify="center"
														items="center"
													>
														<Text color="$surface1" variant="body3">
															+{group.memberCount - 1}
														</Text>
													</Stack>
												</XStack>
												<YStack gap="$3xs">
													<Text variant="subHeading2" color="$neutral1">
														{group.name}
													</Text>
													<Text variant="body3" color="$neutral2">
														{group.memberCount} members
													</Text>
												</YStack>
												<Stack>
													<Text variant="subHeading2" color="$accent1">
														{isUSD ? "$" : symbol}
														{group.payoutAmount.toFixed(0)}
													</Text>
													<Text variant="body4" color="$neutral2">
														Ends on{" "}
														{date.toLocaleDateString("en-US", {
															day: "numeric",
															month: "short",
															year: "numeric",
														})}
													</Text>
												</Stack>
											</YStack>
										);
									})}
						</View>
					</ScrollView>
				)}
			</YStack>
		</Screen>
	);
}

function useGroupSearch(
	searchTerm: string,
	allGroups: GroupSpaceInfo[],
): {
	groups: GroupSpaceInfo[];
	searchTerm: string;
	loading: boolean;
} {
	// get recipients based on searchTerm
	const getGroups = useCallback((): GroupSpaceInfo[] => {
		if (!searchTerm.trim()) {
			return [];
		}

		const groups: GroupSpaceInfo[] = [];
		// Mock implementation
		const matchedGroups: GroupSpaceInfo[] = allGroups.filter((group) => {
			return (
				group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				group.spaceId.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});

		groups.push(...matchedGroups);
		return groups;
	}, [searchTerm, allGroups]);

	const memoGroups = useMemoCompare(getGroups, isEqual);
	const memoResult = useMemo(
		() => ({
			groups: memoGroups,
			searchTerm,
			loading: false,
		}),
		[memoGroups, searchTerm],
	);

	const debouncedResult = useDebounce(memoResult, 500);

	return searchTerm ? debouncedResult : memoResult;
}

const pGroups = [
	{
		spaceId: "0x1001",
		name: "Wahenga",
		admin: "0x765DE816845861e75B25fCA122bb6898B8B1282a",
		token: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
		memberCount: 100,
		payoutAmount: 1000,
		interval: 1209600,
		startDate: 1750599852,
		//type: "challenge",
	},
	{
		spaceId: "0x1002",
		name: "Superstars",
		admin: "0x765DE816845861e75B25fCA122bb6899B8B1282a",
		token: "0x765DE816845861e75B25fCA122bb6898B8B1282a",
		memberCount: 26,
		payoutAmount: 100000,
		interval: 1209600,
		startDate: 1750599852,
		//type: "rosca",
	},
	{
		spaceId: "0x1003",
		name: "FUTURE",
		admin: "0x765DE816845861e75c25fCA122bb6899B8B1282a",
		token: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
		payoutAmount: 5000,
		memberCount: 30,
		interval: 1209600,
		startDate: 1750599852,
		//type: "challenge",
	},
	{
		spaceId: "0x1004",
		name: "Women of Grace",
		admin: "0x765DE816846861e75B25fCA122bb6899B8B1282a",
		token: "0x765DE816845861e75B25fCA122bb6898B8B1282a",
		memberCount: 12,
		payoutAmount: 10000,
		interval: 1209600,
		startDate: 1750599852,
		//type: "rosca",
	},
	{
		spaceId: "0x1005",
		name: "A dollar a day",
		admin: "0x765DE916845861e75B25fCA122bb6899B8B1282a",
		token: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
		memberCount: 30,
		payoutAmount: 365,
		interval: 1209600,
		startDate: 1750599852,
		//type: "challenge",
	},
	{
		spaceId: "0x0006",
		name: "Dream Chasers",
		admin: "0x905DE816845861e75B25fCA122bb6899B8B1282a",
		token: "0x765DE816845861e75B25fCA122bb6898B8B1282a",
		memberCount: 15,
		payoutAmount: 10000,
		interval: 1209600,
		startDate: 1750599852,
		//type: "rosca",
	},
] as GroupSpaceInfo[];

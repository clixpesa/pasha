import { AccountIcon } from "@/components/account/AccountIcon";
import { Screen } from "@/components/layout/Screen";
import { editRosca, getRoscaMembers } from "@/features/contracts/roscas";
import { getChainInfo, useWalletContext } from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import {
	Button,
	ScrollView,
	Spacer,
	Stack,
	Text,
	TextInput,
	TouchableArea,
	XStack,
	YStack,
} from "@/ui";
import {
	CopySheets,
	Edit,
	Logout,
	RoscaFill,
	Search,
	SendAction,
} from "@/ui/components/icons";
import { isSameAddress, shortenAddress } from "@/utilities/addresses";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
	collection,
	getDocs,
	getFirestore,
	query,
	where,
} from "@react-native-firebase/firestore";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import type { Address } from "viem";

export default function GroupInfo() {
	const params = useLocalSearchParams();
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const { defaultChainId } = useEnabledChains();
	const chain = getChainInfo(defaultChainId);
	const [edit, setEdit] = useState<boolean>(false);
	const [name, setName] = useState<string>(params.name as string);
	const [members, setMembers] = useState<Address[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
	const { updateCurrentChainId, mainAccount } = useWalletContext();
	const [userMap, setUserMap] = useState<
		Map<
			Address,
			{ tag: string; evmAddress: string; displayName: string | null } | null
		>
	>(new Map());
	const [isLoading, setIsLoading] = useState<boolean>(false);
	useEffect(() => {
		setIsLoading(true);
		const getSpace = async () => {
			const members = await getRoscaMembers({
				chainId: defaultChainId,
				spaceId: params.spaceId as string,
			});

			if (members) setMembers(members);
			const userMap = await getMemberDetails(members);
			setUserMap(userMap);
			setIsLoading(false);
		};
		setIsLoading(false);
		getSpace();
	}, [defaultChainId]);

	const copyToClipboard = async () => {
		await Clipboard.setStringAsync(params.spaceId as string);
		ToastAndroid.showWithGravity(
			"Id copied successfully",
			2000,
			ToastAndroid.TOP,
		);
	};

	const onCancel = () => {
		//setDate(new Date(Number(params.deadline)));
		setName(params.name as string);
		//setGoal(params.goal as string);
	};
	const onPressSave = async () => {
		setIsSaving(true);
		if (mainAccount) {
			const reciept = await editRosca({
				account: mainAccount,
				chainId: defaultChainId,
				name: name,
				//targetAmount: goal,
				//targetDate: date.valueOf(),
				spaceId: params.spaceId as string,
			});
			//console.log(reciept);
			setIsSaving(false);
		}
	};

	useEffect(() => {
		updateCurrentChainId(defaultChainId);
	}, [defaultChainId, updateCurrentChainId]);

	const getMemberDetails = async (members: Address[]) => {
		const batchSize = 30;
		const usersCollection = collection(getFirestore(), "USERS");
		const userMap = new Map<
			Address,
			{ tag: string; evmAddress: string; displayName: string | null } | null
		>();
		for (let i = 0; i < members.length; i += batchSize) {
			const batch = members.slice(i, i + batchSize);

			const querySnapshot = await getDocs(
				query(usersCollection, where("customClaims.evmAddr", "in", batch)),
			);

			const foundUsers = new Map<
				Address,
				{ tag: string; evmAddress: string; displayName: string | null }
			>();
			querySnapshot.forEach((doc) => {
				const user = doc.data();
				if (user.customClaims?.evmAddr) {
					foundUsers.set(user.customClaims.evmAddr, {
						tag: user.customClaims.tag,
						evmAddress: user.customClaims.evmAddr,
						displayName: user.displayName,
					});
				}
			});
			batch.forEach((Addr) => {
				userMap.set(Addr, foundUsers.get(Addr) || null);
			});
		}
		return userMap;
	};

	const onOpenModal = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				style={[props.style]}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.4}
			/>
		),
		[],
	);

	const handleGroupExit = () => {
		setIsTxLoading(true);
		setTimeout(() => {
			setIsTxLoading(false);
			bottomSheetModalRef.current?.close();
		}, 2000);
	};
	return (
		<Screen>
			<ScrollView showsVerticalScrollIndicator={false} width="100%">
				<YStack mx="$sm" my="$lg" gap="$sm">
					<XStack justify="space-between" items="center" mx="$xl">
						<TouchableArea onPress={() => {}}>
							<AccountIcon
								address={
									chain.contracts?.roscas.address
										? chain.contracts?.roscas.address
										: "0x765de816845861e75a25fca122bb6898b8b1282a"
								}
								size={60}
								showBorder={true}
								borderColor="$tealVibrant"
							/>
						</TouchableArea>
						<YStack gap="$xs" items="flex-end">
							<XStack gap="$sm">
								<TouchableArea
									borderWidth={2}
									borderColor="$surface3Hovered"
									rounded="$md"
									onPress={() => setEdit(!edit)}
								>
									<Edit size={24} m="$xs" color="$neutral2" />
								</TouchableArea>
								<TouchableArea
									borderWidth={2}
									borderColor="$surface3Hovered"
									rounded="$2xl"
									onPress={() => {
										Alert.alert(
											"Keep Calm!",
											"Inviting your friends through links is coming soon. Please copy and share the group id instead.",
											[
												{
													text: "COPY ID",
													onPress: () => copyToClipboard(),
													style: "cancel",
												},
												{
													text: "OK",
													onPress: () => console.log("OK Pressed"),
												},
											],
										);
									}}
								>
									<XStack items="center" m="$xs" gap="$xs">
										<SendAction size={24} color="$neutral2" />
										<Text variant="buttonLabel2" mr="$2xs" color="$neutral2">
											Share
										</Text>
									</XStack>
								</TouchableArea>
							</XStack>
							<XStack
								items="center"
								gap="$2xs"
								mt="$2xs"
								onPress={() => copyToClipboard()}
							>
								<Text color="$neutral2" text="right" variant="body3">
									{params.spaceId}
								</Text>
								<CopySheets size={22} color="$neutral2" />
							</XStack>
						</YStack>
					</XStack>
					{edit ? null : (
						<YStack gap="$2xs" mx="$xl">
							<Text variant="subHeading1">{name}</Text>
						</YStack>
					)}
					{edit ? (
						<XStack justify="space-between" items="center">
							<TextInput
								width="100%"
								placeholder={name}
								value={name}
								onChangeText={(text) => setName(text)}
							/>
						</XStack>
					) : null}
					{edit || isSaving ? (
						<XStack gap="$md" self="center" mt="$xl">
							<Button
								variant="branded"
								emphasis="secondary"
								width="30%"
								onPress={() => {
									onCancel();
								}}
							>
								Cancel
							</Button>
							<Button
								variant="branded"
								width="30%"
								loading={isSaving}
								onPress={() => {
									setEdit(!edit);
									onPressSave();
								}}
							>
								{isLoading ? "Saving..." : "Save"}
							</Button>
						</XStack>
					) : null}
					<XStack justify="space-between" items="center" mx="$lg" mt="$xl">
						<Text>{members.length} members</Text>
						<Search size={22} color="$neutral1" />
					</XStack>
					<YStack bg="$surface1" p="$sm" rounded="$lg" gap="$md">
						{members.map((member) => {
							const user = userMap.get(member);
							return (
								<XStack items="center" justify="space-between" key={member}>
									<XStack gap="$sm" items="center">
										<AccountIcon address={member} size={40} />
										<YStack gap="$2xs">
											<Text>{user?.displayName ?? `@${user?.tag}`}</Text>
											<Text variant="body4">
												{shortenAddress(user?.evmAddress, 5)}
											</Text>
										</YStack>
									</XStack>
									{isSameAddress(member, params.admin as Address) ? (
										<Text
											py={3}
											px={12}
											bg="$accent2"
											rounded="$2xl"
											color="$accent1"
										>
											Admin
										</Text>
									) : null}
								</XStack>
							);
						})}
					</YStack>
					<TouchableArea onPress={onOpenModal}>
						<XStack
							bg="$surface1"
							py="$sm"
							px="$md"
							rounded="$lg"
							gap="$md"
							items="center"
						>
							<Logout size={24} color="$statusCritical" />
							<Text color="$statusCritical">Exit group</Text>
						</XStack>
					</TouchableArea>
				</YStack>
			</ScrollView>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				snapPoints={["50%"]}
				backdropComponent={renderBackdrop}
			>
				<BottomSheetView style={{ flex: 1, alignItems: "center" }}>
					<YStack items="center" gap="$sm" width="100%" my="$3xl">
						<Stack
							bg="$accent2"
							height={60}
							rounded="$md"
							width={60}
							items="center"
							justify="center"
						>
							<RoscaFill size={28} color="$accent1" />
						</Stack>
						<YStack gap="$2xs" items="center">
							<Text>
								{isActive
									? "Ops! You can't leave"
									: "Are you sure you want to leave"}
							</Text>
							<Text variant="subHeading1">{params.name}</Text>
							{isActive ? (
								<Text text="center" px="$3xl" color="$statusCritical">
									You can not leave an active Group until the circle is
									complete!
								</Text>
							) : null}
						</YStack>
						<Spacer flex={1} />
						{isActive ? null : (
							<Button
								size="lg"
								variant={isActive ? "warning" : "branded"}
								width="85%"
								isDisabled={isActive}
								loading={isTxLoading}
								onPress={() => handleGroupExit()}
							>
								{isTxLoading ? "Leaving Group..." : "Confirm Exit"}
							</Button>
						)}
						<Button
							size="lg"
							variant="branded"
							emphasis="secondary"
							width="85%"
							onPress={() => bottomSheetModalRef.current?.close()}
						>
							Cancel
						</Button>
					</YStack>
				</BottomSheetView>
			</BottomSheetModal>
		</Screen>
	);
}

import { AccountIcon } from "@/components/account/AccountIcon";
import { Screen } from "@/components/layout/Screen";
import { addMember } from "@/features/contracts/roscas";
import { useWalletContext } from "@/features/wallet";
import { useEnabledChains } from "@/features/wallet/hooks";
import { Button, SpinningLoader, Stack, Text, XStack, YStack } from "@/ui";
import { PapersText } from "@/ui/components/icons";
import {
	arrayRemove,
	doc,
	getDoc,
	getFirestore,
	updateDoc,
} from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";

export default function GroupNotifications() {
	const params = useLocalSearchParams();
	const [requests, setRequests] = useState([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { defaultChainId } = useEnabledChains();
	const { mainAccount } = useWalletContext();

	useEffect(() => {
		(async () => {
			const roscaDoc = await getDoc(
				doc(getFirestore(), "SPACES", params.spaceId as string),
			);
			if (roscaDoc.exists()) {
				const spaceData = roscaDoc.data();
				const requests = spaceData?.requests || [];
				if (requests.length > 0) {
					const userPromises = requests.map((ref) => getDoc(ref));

					const userSnapshots = await Promise.all(userPromises);
					const usersData = userSnapshots.map((snap) => {
						const user = snap.data();
						return {
							id: user.uid,
							address: user.customClaims.evmAddr,
							tag: user.customClaims.tag,
							name: user.displayName,
						};
					});
					setRequests(usersData);
				}
			}
		})();
	}, []);

	const onPressReject = async (id: string) => {
		try {
			console.log(id);
			const spaceRef = doc(getFirestore(), "SPACES", params.spaceId as string);
			const userRef = doc(getFirestore(), "USERS", id);

			await updateDoc(spaceRef, {
				requests: arrayRemove(userRef),
			});
			setRequests((prevRequests) =>
				prevRequests.filter((request) => request.id !== id),
			);
			console.log(`User ${id} removed from requests`);
		} catch (error) {
			console.error("Error removing request:", error);
		}
	};

	const onPressAccept = async (id: string) => {
		setIsLoading(true);
		console.log(id);
		const spaceRef = doc(getFirestore(), "SPACES", params.spaceId as string);
		const userRef = doc(getFirestore(), "USERS", id);
		const user = await getDoc(userRef).then((user) => user.data());
		const result = await addMember({
			chainId: defaultChainId,
			spaceId: params.spaceId as string,
			account: mainAccount,
			member: user?.customClaims.evmAddr,
		});
		console.log(result);
		if (result.txHash.length > 3) {
			await updateDoc(spaceRef, {
				requests: arrayRemove(userRef),
			});
			setRequests((prevRequests) =>
				prevRequests.filter((request) => request.id !== id),
			);
			ToastAndroid.showWithGravity(
				`${user?.displayName ?? `@${user?.customClaims.tag}`} added successfully!`,
				2000,
				ToastAndroid.TOP,
			);
		}
		setIsLoading(false);
	};

	return (
		<Screen title="Notifications">
			{requests.length > 0 ? (
				requests.map((request) => (
					<XStack
						key={request.id}
						mt="$sm"
						gap="$md"
						self="flex-start"
						mx="$xl"
					>
						<AccountIcon size={52} address={request.address} />
						<YStack gap="$xs">
							<YStack>
								<Text>{request.name ?? `@${request.tag}`}</Text>
								<Text variant="body3" color="$neutral2">
									has requested to join the chama
								</Text>
							</YStack>
							{isLoading ? (
								<XStack gap="$md">
									<SpinningLoader size={24} />
									<Text>Adding member to group</Text>
								</XStack>
							) : (
								<XStack gap="$md">
									<Button
										size="sm"
										variant="branded"
										onPress={() => onPressAccept(request.id)}
									>
										Accept
									</Button>
									<Button
										size="sm"
										variant="branded"
										emphasis="secondary"
										onPress={() => onPressReject(request.id)}
									>
										Reject
									</Button>
								</XStack>
							)}
						</YStack>
					</XStack>
				))
			) : (
				<XStack
					items="center"
					gap="$lg"
					rounded="$lg"
					bg="$surface2"
					width="92%"
					p="$sm"
					mt="$xl"
				>
					<Stack
						bg="$neutral3"
						height={48}
						rounded="$full"
						width={48}
						items="center"
						justify="center"
					>
						<PapersText size={30} color="$surface1" />
					</Stack>
					<Text variant="subHeading1" color="$neutral2">
						No notifications yet
					</Text>
				</XStack>
			)}
		</Screen>
	);
}

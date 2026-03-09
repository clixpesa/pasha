import { AccountIcon } from "@/components/account/AccountIcon";
import { Screen } from "@/components/layout/Screen";
import { ScrollView, Stack, Text, TouchableArea, XStack, YStack } from "@/ui";
import {
	AtLine,
	PapersText,
	Person,
	PhoneFill,
	RotatableChevron,
} from "@/ui/components/icons";
import { getAuth, getIdTokenResult } from "@react-native-firebase/auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function EditProfile() {
	const user = getAuth().currentUser;
	const [claims, setClaims] = useState();

	useEffect(() => {
		(async () => {
			if(user){
				const claims = await getIdTokenResult(user, true).then(
				(tokenResults) => tokenResults.claims,
				);
				setClaims(claims);
			}
			
		})();
	}, [user]);

	return (
		<Screen title="Profile">
			<ScrollView showsVerticalScrollIndicator={false} width="100%">
				<TouchableArea onPress={() => {}}>
					<Stack self="center">
						<AccountIcon
							address={
								claims
									? claims.evmAddr
									: "0x765de816845861e75a25fca122bb6898b8b1282a"
							}
							size={80}
							showBorder={true}
							borderColor="$tealVibrant"
							avatarUri={user?.photoURL}
						/>
					</Stack>
				</TouchableArea>
				<YStack width="92%" self="center" gap="$xs" mt="$3xl">
					<TouchableArea onPress={() => {}}>
						<XStack
							justify="space-between"
							items="center"
							bg="$surface1"
							px="$sm"
							py="$vs"
							rounded="$lg"
						>
							<XStack items="center" gap="$sm">
								<AtLine size={32} color="$neutral2" />
								{claims ? (
									<YStack gap="$3xs">
										<Text variant="body3">@{claims.tag}</Text>
										<Text color="$neutral2">{claims.tag}.clix.eth</Text>
									</YStack>
								) : (
									<Text>Loading...</Text>
								)}
							</XStack>
							{/*<RotatableChevron direction="right" />*/}
						</XStack>
					</TouchableArea>
					<TouchableArea
						onPress={() => router.navigate("/(essentials)/account/edit-name")}
					>
						<XStack
							justify="space-between"
							items="center"
							bg="$surface1"
							px="$sm"
							py="$vs"
							rounded="$lg"
						>
							<XStack items="center" gap="$sm">
								<Person size={32} color="$neutral2" />
								<YStack gap="$3xs">
									<Text variant="body3">Profile name</Text>
									<Text color={user?.displayName ? "$neutral2" : "$accent1"}>
										{user?.displayName ? user.displayName : "Add name"}
									</Text>
								</YStack>
							</XStack>
							<RotatableChevron direction="right" />
						</XStack>
					</TouchableArea>
					<TouchableArea
						onPress={() =>
							router.navigate({
								pathname: "/(essentials)/account/link-emailorphone",
								params: { link: "phone" },
							})
						}
					>
						<XStack
							justify="space-between"
							items="center"
							bg="$surface1"
							px="$sm"
							py="$vs"
							rounded="$lg"
						>
							<XStack items="center" gap="$sm">
								<PhoneFill size={32} color="$neutral2" />
								<YStack gap="$3xs">
									<Text variant="body3">Phone number</Text>
									<Text color={user?.phoneNumber ? "$neutral2" : "$accent1"}>
										{user?.phoneNumber ? user.phoneNumber : "Link phone"}
									</Text>
								</YStack>
							</XStack>
							<RotatableChevron direction="right" />
						</XStack>
					</TouchableArea>
					<TouchableArea
						onPress={() =>
							router.navigate({
								pathname: "/(essentials)/account/link-emailorphone",
								params: { link: "email" },
							})
						}
					>
						<XStack
							justify="space-between"
							items="center"
							bg="$surface1"
							px="$sm"
							py="$vs"
							rounded="$lg"
						>
							<XStack items="center" gap="$sm">
								<PapersText size={28} color="$neutral2" />
								<YStack gap="$3xs">
									<Text variant="body3">Email</Text>
									<Text color={user?.email ? "$neutral2" : "$accent1"}>
										{user?.email ? user.email : "Link email"}
									</Text>
								</YStack>
							</XStack>
							<RotatableChevron direction="right" />
						</XStack>
					</TouchableArea>
				</YStack>
			</ScrollView>
		</Screen>
	);
}

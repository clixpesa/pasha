import { HeaderBackButton } from "@/components/Buttons/HeaderNavButtons";
import { AccountIcon } from "@/components/account/AccountIcon";
import { Settings } from "@/components/account/Settings";
import { useAppState } from "@/features/essentials/appState";
import {
	LinearGradient,
	ScrollView,
	Text,
	TouchableArea,
	View,
	XStack,
	YStack,
} from "@/ui";

import {
	BookOpen,
	Contrast,
	Edit,
	HelpCenter,
	LikeSquare,
	Lock,
	Logout,
	SendAction,
	XTwitter,
} from "@/ui/components/icons";
import { shortenAddress } from "@/utilities/addresses";
import { redirect } from "@/utilities/links/redirect";
import { getAuth, getIdTokenResult } from "@react-native-firebase/auth";
import * as Application from "expo-application";
import { openURL } from "expo-linking";
import { router, usePathname } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";

export default function AccountScreen() {
	const user = useAppState((s) => s.user);
	const pathname = usePathname();
	const dispatch = useDispatch();
	const setIsUnlocked = useAppState((s) => s.setIsUnlocked);
	const [clixtag, setClixtag] = useState<string>();

	useEffect(() => {
		const getClixtag = async () => {
			const user = getAuth().currentUser;
      if(user){
        const clixtag = await getIdTokenResult(user, true).then(
				(tokenResult) => tokenResult.claims.tag,
			);
			setClixtag(clixtag);
      }
			
		};
		getClixtag();
	}, []);

	return (
		<View flex={1} bg="$surface1">
			<LinearGradient
				width="100%"
				height="100%"
				colors={["$surface1", "$surface3"]}
				position="absolute"
			/>
			<XStack
				width="100%"
				items="center"
				py="$sm"
				px="$sm"
				justify="space-between"
			>
				<HeaderBackButton />
				<Text variant="subHeading1" fontWeight="$md" color="$neutral1">
					Account
				</Text>
				<TouchableArea rounded="$full" px="$sm" onPress={() => {}} />
			</XStack>
			<ScrollView showsVerticalScrollIndicator={false}>
				<YStack mx="$2xl" my="$lg" gap="$sm">
					<XStack justify="space-between" items="center">
						<TouchableArea
							onPress={() => router.navigate("/account/edit-profile")}
						>
							<AccountIcon
								address={
									user.mainAddress
										? user.mainAddress
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
									onPress={() => router.navigate("/account/edit-profile")}
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
											"Sharing your account with your friends is coming soon.",
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
							<Text color="$neutral2" text="right" variant="body3">
								{user.mainAddress
									? shortenAddress(user.mainAddress, 6)
									: shortenAddress(
											"0x765de816845861e75a25fca122bb6898b8b1282a",
										)}
							</Text>
						</YStack>
					</XStack>
					<YStack gap="$2xs">
						<Text variant="subHeading1">{clixtag}.clix.eth</Text>
						<Text color="$neutral2">{user.phoneNumber || user.email}</Text>
					</YStack>
				</YStack>
				<Settings my="$md">
					<Settings.Items>
						{/*<Settings.Title>Preferences</Settings.Title>
						<Settings.Group>
							<SettingsThemeAction />
							<Settings.Item icon={Coins}>Local currency</Settings.Item>
						</Settings.Group>

						<Settings.Title>Security</Settings.Title>
						<Settings.Group>
							<Settings.Item icon={Fingerprint}>Biometrics</Settings.Item>

							<Settings.Item
								icon={Passkey}
								isActive={pathname === "/settings/change-password"}
								onPress={() => {}}
							>
								Change Passcode
							</Settings.Item>
							<Settings.Item icon={FileListLock}>Recovery phrase</Settings.Item>

							<Settings.Item icon={Cloud}>Google Drive backup</Settings.Item>
						</Settings.Group>*/}
						<Settings.Title>Support</Settings.Title>
						<Settings.Group>
							<Settings.Item
								icon={LikeSquare}
								onPress={() => openBrowserAsync("https://tally.so/r/w5zBj6")}
							>
								Share feedback
							</Settings.Item>
							<Settings.Item
								onPress={() => openURL("https://wa.me/+254728682258")}
								icon={HelpCenter}
							>
								Help and Support
							</Settings.Item>
						</Settings.Group>
						<Settings.Title>About</Settings.Title>
						<Settings.Group>
							<Settings.Item
								icon={Lock}
								onPress={() =>
									openBrowserAsync("https://clixpesa.com/privacy-policy/")
								}
							>
								Privacy Policy
							</Settings.Item>
							<Settings.Item
								icon={BookOpen}
								onPress={() =>
									openBrowserAsync("https://clixpesa.com/terms-conditions/")
								}
							>
								Terms of Service
							</Settings.Item>
						</Settings.Group>
						<Settings.Group>
							<Settings.Item
								icon={XTwitter}
								onPress={() => redirect("https://x.com/pashamoney")}
							>
								Follow us on X
							</Settings.Item>
						</Settings.Group>
						<Settings.Group>
							<SettingsItemLogoutAction />
						</Settings.Group>
					</Settings.Items>
				</Settings>
				<Text p="$lg" text="center" color="$neutral2" variant="body3">
					v{Application.nativeApplicationVersion} (
					{Application.nativeBuildVersion})
				</Text>
			</ScrollView>
		</View>
	);
}

const SettingsThemeAction = () => {
	// const { toggle, current } = useThemeSetting()

	return <Settings.Item icon={Contrast}>Theme</Settings.Item>;
};

const SettingsItemLogoutAction = () => {
	//const { signOut } = useAuth();

	return (
		<Settings.Item
			icon={Logout}
			onPress={async () => {
				await getAuth().signOut();
			}}
		>
			Log Out
		</Settings.Item>
	);
};

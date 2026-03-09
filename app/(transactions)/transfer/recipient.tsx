import { AccountIcon } from "@/components/account/AccountIcon";
import { Screen } from "@/components/layout/Screen";
import { useRecipientSearch } from "@/features/essentials";
import { useAppState } from "@/features/essentials/appState";
import {
	ActivityLoader,
	Input,
	Loader,
	ScrollView,
	Stack,
	Text,
	TouchableArea,
	XStack,
	YStack,
} from "@/ui";
import { Person, ScanQr, Search, X } from "@/ui/components/icons";
import { shortenAddress } from "@/utilities/addresses";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

export default function RecipientScreen() {
	const inputRef = useRef<Input>(null);
	const [searchText, setSearchText] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { recipients, searchTerm, loading } = useRecipientSearch(searchText);
	const recentRecipients = useAppState((s) => s.recentRecipients);

	const handleTextChange = (text: string) => {
		setSearchText(text);
		setTimeout(() => {
			inputRef.current?.setNativeProps({
				contentOffset: { x: Number.MAX_SAFE_INTEGER, y: 0 },
			});
		}, 50);
	};

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 50);
	}, []);

	/*useEffect(() => {
		(async () => {
			const { status } = await Contacts.requestPermissionsAsync();
			if (status === "granted") {
				const { data } = await Contacts.getContactsAsync({
					fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
				});

				if (data.length > 0) {
					//const contact = data[0];
					const contacts = data.flatMap((contact) => {
						if (contact.id && contact.phoneNumbers?.[0])
							return {
								id: contact.id,
								name: contact.name,
								phone:
									contact.phoneNumbers?.[0].number?.trim().replace(/\s/g, "") ??
									null,
							};
					});
					const cleanContacts = contacts.filter(Boolean);
					setContacts(cleanContacts);
				}
			}
			setIsLoading(false);
		})();
	}, []);*/

	return (
		<Screen
			title="Select recipient"
			rightElement={{
				Icon: <ScanQr size={24} color="$neutral2" />,
				onPress: () => {},
			}}
		>
			<YStack gap="$sm" width="92%">
				<XStack
					borderWidth={2}
					borderColor="$surface3"
					rounded="$vl"
					items="center"
					px="$sm"
					gap="$vs"
					mt="$xl"
					mb="$sm"
				>
					<Search size={24} color="$neutral2" />
					<Input
						ref={inputRef}
						fontSize="$lg"
						autoFocus
						autoCapitalize="none"
						autoCorrect={false}
						px={1}
						placeholder="search phone, tag or address"
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
				) : !recipients.length && searchText.length ? (
					<Stack items="center" px="$sm" py="$md" bg="$surface1" rounded="$lg">
						<Text variant="buttonLabel2">No results found</Text>
						<Text color="$neutral3" text="center" variant="body2">
							The recipient you searched does not exist or is spelled
							incorrectly.
						</Text>
					</Stack>
				) : recipients[0] ? (
					recipients.slice(0, 2).map((recipient) => (
						<TouchableArea
							key={recipient.id}
							onPress={() => {
								recipient.address
									? router.navigate({
											pathname: "/(transactions)/transfer/send",
											params: {
												name: recipient.name
													? recipient.name
													: shortenAddress(recipient.address, 5),
												address: recipient.address,
												phone: recipient.name
													? recipient.phone
														? recipient.phone
														: shortenAddress(recipient.address, 6)
													: "External account",
											},
										})
									: Alert.alert(
											"User not Clixpesa yet!",
											"Please invite them over by sending them the link to our app.",
										);
							}}
						>
							<XStack
								items="center"
								px="$sm"
								gap="$sm"
								bg="$surface1"
								rounded="$lg"
								py="$md"
							>
								{recipient.address ? (
									<AccountIcon size={42} address={recipient.address} />
								) : (
									<Stack
										bg="$accent2"
										height={42}
										rounded="$full"
										width={42}
										items="center"
										justify="center"
									>
										<Person size={32} color="$accent1" />
									</Stack>
								)}
								<YStack gap="$2xs">
									<Text variant="subHeading2">
										{recipient.name
											? recipient.name
											: shortenAddress(recipient.address, 5)}
									</Text>
									<Text variant="body3" color="$neutral2">
										{recipient.name
											? recipient.phone
												? recipient.phone
												: shortenAddress(recipient.address, 6)
											: "External account"}
									</Text>
								</YStack>
							</XStack>
						</TouchableArea>
					))
				) : null}
				<ScrollView showsVerticalScrollIndicator={false}>
					<YStack
						bg="$surface1"
						width="100%"
						px="$sm"
						pt="$md"
						pb={isLoading ? "$2xs" : "$xl"}
						rounded="$lg"
						gap="$md"
					>
						<Text color="$neutral2" pl="$xs">
							Most Recent
						</Text>
						{isLoading ? (
							<ActivityLoader opacity={1} />
						) : recentRecipients.length > 0 ? (
							recentRecipients.map((item) => (
								<TouchableArea
									key={item.id}
									onPress={() =>
										router.navigate({
											pathname: "/(transactions)/transfer/send",
											params: {
												name: item.name
													? item.name
													: shortenAddress(item.address, 5),
												address: item.address,
												phone: item.name
													? item.phone
														? item.phone
														: shortenAddress(item.address, 6)
													: "External account",
											},
										})
									}
								>
									<XStack items="center" gap="$sm">
										<AccountIcon size={42} address={item.address} />
										<YStack gap="$2xs">
											<Text variant="subHeading2">
												{item.name
													? item.name
													: shortenAddress(item.address, 5)}
											</Text>
											<Text variant="body3" color="$neutral2">
												{item.name
													? item.phone
														? item.phone
														: shortenAddress(item.address, 6)
													: "External account"}
											</Text>
										</YStack>
									</XStack>
								</TouchableArea>
							))
						) : (
							<XStack items="center" gap="$sm">
								<Stack
									bg="$neutral3"
									height={42}
									rounded="$full"
									width={42}
									items="center"
									justify="center"
								>
									<Person size={32} color="$surface1" />
								</Stack>
								<Text variant="subHeading1" color="$neutral2">
									{" "}
									No recents yet
								</Text>
							</XStack>
						)}
					</YStack>
					{/*!searchTerm ? (
						<YStack
							bg="$surface1"
							width="100%"
							px="$sm"
							pt="$md"
							pb={isLoading ? "$2xs" : "$xl"}
							rounded="$lg"
							mt="$md"
							mb="50%"
							gap="$md"
						>
							<Text color="$neutral2" pl="$xs">
								Your Contacts
							</Text>
							{isLoading ? (
								<ActivityLoader opacity={1} />
							) : contacts?.length > 0 ? (
								contacts?.slice(1, 40).map((item) => (
									<TouchableArea
										key={item?.id}
										/*onPress={() =>
									router.navigate({
										pathname: "/(transactions)/transfer/send",
										params: {
											name: item.name
												? item.name
												: shortenAddress(item.address, 5),
											address: item.address,
											phone: item.name
												? item.phone
													? item.phone
													: shortenAddress(item.address, 6)
												: "External account",
										},
									})
								}
									>
										<XStack items="center" gap="$sm">
											<Stack
												bg="$accent2"
												height={42}
												rounded="$full"
												width={42}
												items="center"
												justify="center"
											>
												<Person size={32} color="$accent1" />
											</Stack>
											<YStack gap="$2xs">
												<Text variant="subHeading2">{item?.name}</Text>
												<Text variant="body3" color="$neutral2">
													{item?.phone}
												</Text>
											</YStack>
										</XStack>
									</TouchableArea>
								))
							) : (
								<XStack items="center" gap="$sm">
									<Stack
										bg="$neutral3"
										height={42}
										rounded="$full"
										width={42}
										items="center"
										justify="center"
									>
										<Person size={32} color="$surface1" />
									</Stack>
									<Text variant="subHeading1" color="$neutral2">
										{" "}
										No Contacts
									</Text>
								</XStack>
							)}
						</YStack>
					) : null*/}
				</ScrollView>
			</YStack>
		</Screen>
	);
}

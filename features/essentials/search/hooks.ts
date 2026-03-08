import { isAddress, isSameAddress } from "@/utilities/addresses";
import { useMemoCompare } from "@/utilities/react/hooks";
import { useDebounce } from "@/utilities/time/timing";
import {
	collection,
	getDocs,
	getFirestore,
	FirebaseFirestoreTypes
} from "@react-native-firebase/firestore";
import * as Contacts from "expo-contacts";
import { Address } from "viem";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface SearchableRecipient {
	id: string;
	name: string | null;
	address: Address;
	phone: string | null;
	tag: string | null;
}

export function useRecipientSearch(searchTerm: string): {
	recipients: SearchableRecipient[];
	searchTerm: string;
	loading: boolean;
} {
	const [contacts, setContacts] = useState<
		({ id: string; name: string; phone: string | null } | undefined)[]
	>([]);
	const [searchableUsers, setSearchableUsers] = useState<SearchableRecipient[]>(
		[],
	);

	useEffect(() => {
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
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const users: SearchableRecipient[] = [];
			const qSnapshot = await getDocs(collection(getFirestore(), "USERS"));
			qSnapshot.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
				const user = doc.data();
				const claims = user.customClaims;
				users.push({
					id: user.uid,
					address: claims?.mainAddr ?? null,
					name: user.displayName ?? null,
					phone: user.phoneNumber ?? null,
					tag: claims?.tag ?? null,
				});
			});
			for (const contact of contacts) {
				users.push({
					id: contact?.id,
					address: null,
					name: contact?.name,
					phone: contact?.phone,
					tag: null,
				});
			}
			setSearchableUsers(users);
		})();
	}, [contacts]);
	// get recipients based on searchTerm
	const getRecipients = useCallback((): SearchableRecipient[] => {
		if (!searchTerm.trim()) {
			return [];
		}

		const recipients: SearchableRecipient[] = [];
		const isAddressSearch =
			searchTerm.startsWith("0x") && isAddress(searchTerm);
		const isPhoneSearch =
			(searchTerm.startsWith("+") || searchTerm.startsWith("0")) &&
			searchTerm.length > 9 &&
			!isAddressSearch;
		// Mock implementation
		const matchedUsers: SearchableRecipient[] = searchableUsers.filter(
			(user) => {
				if (isAddressSearch) {
					return isSameAddress(user?.address, searchTerm);
				}
				if (isPhoneSearch) {
					return user.phone?.includes(searchTerm.slice(2));
				}
				return (
					user?.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user?.address?.toLowerCase().includes(searchTerm.toLowerCase())
				);
			},
		);
		if (isAddressSearch && matchedUsers.length === 0) {
			recipients.push({
				id: `addr-${searchTerm}`,
				name: null,
				address: searchTerm as Address,
				phone: null,
				tag: null,
			});
		}
		recipients.push(
			...matchedUsers.map((user) => ({
				id: user.id,
				name: user.name ? user.name : !user.tag ? null : `@${user.tag}`,
				address: user.address as Address,
				phone: user.phone,
				tag: user.tag,
			})),
		);
		return recipients;
	}, [searchTerm, searchableUsers]);

	const memoRecipients = useMemoCompare(getRecipients, isEqual);
	const memoResult = useMemo(
		() => ({
			recipients: memoRecipients,
			searchTerm,
			loading: false,
		}),
		[memoRecipients, searchTerm],
	);

	const debouncedResult = useDebounce(memoResult, 200);

	return searchTerm ? debouncedResult : memoResult;
}

export function useTagSearch(searchTerm: string) {
	const [searchTags, setSearchTags] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [result, setResult] = useState<{
		isAvailable: boolean;
		searchTerm: string;
	}>({ isAvailable: false, searchTerm: "" });

	const [processedTerm, setProcessedTerm] = useState<string>("");

	useEffect(() => {
		(async () => {
			const tags: string[] = [];
			const qSnapshot = await getDocs(collection(getFirestore(), "USERS"));
			qSnapshot.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
				const user = doc.data();
				const claims = user.customClaims;
				tags.push(claims?.tag ?? null);
			});
			setSearchTags(tags.filter(Boolean));
		})();
	}, []);

	useEffect(() => {
		if (!searchTerm.trim()) {
			setResult({ isAvailable: false, searchTerm: searchTerm });
			setProcessedTerm(searchTerm);
			setIsLoading(false);
			return;
		}

		if (searchTerm !== processedTerm) {
			setIsLoading(true);
		}

		const timer = setTimeout(() => {
			const matchingTags = searchTags.filter(
				(tag) => tag.toLowerCase() === searchTerm.trim().toLowerCase(),
			);
			setResult({
				isAvailable: !matchingTags.length && searchTerm.length >= 3,
				searchTerm: searchTerm,
			});
			setProcessedTerm(searchTerm);
			setIsLoading(false);
		}, 400); // Debounce delay

		return () => clearTimeout(timer);
	}, [searchTerm, searchTags, processedTerm]);

	return { ...result, loading: isLoading };
}

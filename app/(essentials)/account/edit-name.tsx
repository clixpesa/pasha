import { Screen } from "@/components/layout/Screen";
import { Button, Spacer, Text, TextInput, YStack } from "@/ui";
import { getAuth, updateProfile } from "@react-native-firebase/auth";
import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useState } from "react";

export default function EditName() {
	const user = getAuth().currentUser;
	const [name, setName] = useState<string>(user?.displayName ?? "");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const updateName = async () => {
		setIsLoading(true);
		if(user){
			await updateProfile(user, { displayName: name });
			await updateDoc(doc(getFirestore(), "USERS", user?.uid), {
			displayName: name,
		});
		}
		setIsLoading(false);
		router.back();
	};
	return (
		<Screen title="Name">
			<YStack width="92%" gap="$sm" mt="$3xl">
				<TextInput
					value={name}
					placeholder="name"
					autoFocus
					onChangeText={(text) => setName(text)}
				/>
				<Text variant="body4" color="$neutral2" text="center">
					People will see this name when you intract in groups and send
					transactions
				</Text>
			</YStack>
			<Spacer />
			<Button
				position="absolute"
				b="$3xl"
				width="85%"
				size="lg"
				loading={isLoading}
				variant="branded"
				onPress={() => updateName()}
			>
				Save
			</Button>
		</Screen>
	);
}

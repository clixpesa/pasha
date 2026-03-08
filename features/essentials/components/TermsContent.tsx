import { Text } from "@/ui";
//import { openUri } from 'uniswap/src/utils/linking'

const openUri = async (uri: any) => {
	console.log(uri);
};

export function TermsOfService(): JSX.Element {
	return (
		<Text color="$neutral2" mx="$2xs" text="center" variant="body4">
			By continuing, I agree to the
			<Text
				color="$accent1"
				variant="body4"
				onPress={(): Promise<void> => openUri("#")}
			>
				{" "}
				Terms of Service{" "}
			</Text>
			and consent to the
			<Text
				color="$accent1"
				variant="body4"
				onPress={(): Promise<void> => openUri("#")}
			>
				{" "}
				Privacy Policy
			</Text>
		</Text>
	);
}

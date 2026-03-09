import { useEnabledChains } from "@/features/wallet/hooks";
import { Text, XStack } from "@/ui";
import { Wrench } from "@/ui/components/icons";

export function TestnetModeBanner(): JSX.Element | null {
	const { isTestnet } = useEnabledChains();
	if (!isTestnet) return null;
	return (
		<XStack
			gap="$md"
			p="$xs"
			bg="$statusSuccess2"
			items="center"
			justify="center"
			borderWidth={1}
			borderStyle="dashed"
			borderColor="$surface3"
		>
			<Wrench color="$statusSuccess" size={20} />
			<Text color="$statusSuccess" variant="body3">
				Testnet Mode
			</Text>
		</XStack>
	);
}

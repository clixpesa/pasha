import type { ChainId } from "@/features/wallet";
import {
	type ColorTokens,
	Stack,
	type StackProps,
	Unicon,
	UniversalImage,
	UniversalImageResizeMode,
} from "@/ui";
import { NetworkLogo } from "../logos/NetworkLogo";

interface AccountIconProps {
	size: number;
	chainId?: ChainId | null;
	address: string;
	avatarUri?: string | null;
	showBackground?: boolean; // Display images with solid background.
	showBorder?: boolean; // Display border stroke around image
	borderWidth?: StackProps["borderWidth"];
	borderColor?: ColorTokens;
}

export function AccountIconWChainLogo({
	size,
	chainId,
	address,
	avatarUri,
	showBackground,
	showBorder,
	borderColor = "$surface1",
	borderWidth = "$3xs",
}: AccountIconProps): JSX.Element {
	const uniconImage = <Unicon address={address} size={size} />;
	const networkLogoSize = Math.round(size * 0.4);

	return (
		<Stack
			bg={showBackground ? "$surface1" : "$transparent"}
			borderColor={showBorder ? borderColor : "$transparent"}
			rounded="$full"
			borderWidth={showBorder ? borderWidth : "$none"}
			position="relative"
			mb="$2xs"
			testID="account-icon"
		>
			{avatarUri ? (
				<UniversalImage
					style={{ image: { borderRadius: size } }}
					fallback={uniconImage}
					size={{
						width: size,
						height: size,
						resizeMode: UniversalImageResizeMode.Cover,
					}}
					uri={avatarUri}
				/>
			) : (
				uniconImage
			)}
			{chainId && (
				<Stack bg="$surface2" b={-2} position="absolute" r={-3} rounded="$xs">
					<NetworkLogo
						borderWidth={2}
						chainId={chainId}
						size={networkLogoSize}
					/>
				</Stack>
			)}
		</Stack>
	);
}

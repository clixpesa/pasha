import type { ChainId } from "@/features/wallet";
import { Loader, Stack, Text, UniversalImage, useThemeColors } from "@/ui";
import { tokens } from "@/ui/theme/tokens";
import { memo, useState } from "react";
import { NetworkLogo } from "./NetworkLogo";

interface TokenLogoProps {
	url?: string | null;
	symbol?: string;
	name?: string;
	chainId?: ChainId | null;
	size?: number;
	hideNetworkLogo?: boolean;
	loading?: boolean;
}

export const TokenLogo = memo(function _TokenLogo({
	url,
	symbol,
	name,
	chainId,
	size = 42,
	hideNetworkLogo,
	loading,
}: TokenLogoProps): JSX.Element {
	const [showBackground, setShowBackground] = useState(false);
	const colors = useThemeColors();
	const showNetworkLogo = !hideNetworkLogo && chainId;
	const networkLogoSize = Math.round(size * 0.4);

	const fallback = (
		<Stack
			items="center"
			rounded="$full"
			height={size}
			justify="center"
			px="$vs"
			bg="$tealLight"
			width={size}
		>
			<Text
				adjustsFontSizeToFit
				$platform-web={{
					// adjustFontSizeToFit is a react-native-only prop
					fontSize: 10,
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "clip",
				}}
				allowFontScaling={false}
				color="$accent1"
				fontFamily="$button"
				fontSize={17}
				fontWeight="500"
				lineHeight={14}
				minimumFontScale={0.5}
				numberOfLines={1}
			>
				{symbol?.slice(0, 3)}
			</Text>
		</Stack>
	);
	const tokenImage = (
		<UniversalImage
			allowLocalUri
			fallback={fallback}
			size={{ height: size, width: size }}
			style={{
				image: {
					borderRadius: size / 2,
					zIndex: 1,
				},
			}}
			testID="token-image"
			uri={url ?? undefined}
			onLoad={() => setShowBackground(true)}
		/>
	);
	if (loading) {
		return <Loader.Box rounded="$full" height={size} width={size} />;
	}
	return (
		<Stack
			items="center"
			justify="center"
			height={size}
			width={size}
			pointerEvents="auto"
			position="relative"
		>
			<Stack
				opacity={showBackground ? 1 : 0}
				height="96%"
				width="96%"
				z={tokens.zIndex.background}
				bg={colors.white.val}
				position="absolute"
				t="2%"
				l="2%"
				rounded={size / 2}
			/>
			{tokenImage}
			{showNetworkLogo && (
				<Stack b={-2} position="absolute" r={-3} z={tokens.zIndex.mask}>
					<NetworkLogo
						borderWidth={2}
						chainId={chainId}
						size={networkLogoSize}
					/>
				</Stack>
			)}
		</Stack>
	);
});

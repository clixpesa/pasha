import { type ChainId, getChainInfo } from "@/features/wallet";
import {
	Stack,
	type StackProps,
	UniversalImage,
	UniversalImageResizeMode,
	useThemeColors,
} from "@/ui";
import { tokens } from "@/ui/theme/tokens";
import React from "react";

export const SQUIRCLE_BORDER_RADIUS_RATIO = 0.3;

type NetworkLogoProps = StackProps & {
	chainId: ChainId | null; // null signifies this is the AllNetworks logo
	size?: number;
	shape?: "circle" | "square";
	borderWidth?: number;
	borderRadius?: number;
};

export function TransactionSummaryNetworkLogo({
	chainId,
	size = tokens.icon.xs.val,
}: Pick<NetworkLogoProps, "chainId" | "size">): JSX.Element {
	return (
		<NetworkLogo
			borderWidth={1.5}
			chainId={chainId}
			shape="square"
			size={size}
		/>
	);
}

function _NetworkLogo({
	chainId,
	shape,
	size: sizeWithoutBorder = tokens.icon.xs.val,
	borderWidth = 0,
	borderRadius,
}: NetworkLogoProps): JSX.Element | null {
	const size = sizeWithoutBorder + 2 * borderWidth;
	const shapeBorderRadius =
		shape === "circle" ? size / 2 : size * SQUIRCLE_BORDER_RADIUS_RATIO;
	const colors = useThemeColors();

	const imageStyle = {
		width: size,
		height: size,
		borderRadius: borderRadius ?? shapeBorderRadius,
		borderWidth,
		borderColor: colors.surface1.val,
	};

	if (chainId === null) {
		return (
			<Stack testID="all-networks-logo">
				<NetworkImage
					logo={require("@/ui/assets/images/network-logos/all-networks.png")}
					imageSize={size}
				/>
			</Stack>
		);
	}

	const logo = getChainInfo(chainId).logo;
	const imageSize = size - borderWidth * 2; // this prevents the border from cutting off the logo

	return logo ? (
		<Stack
			testID="network-logo"
			overflow="hidden"
			style={imageStyle}
			z={tokens.zIndex.mask}
		>
			<NetworkImage logo={logo} imageSize={imageSize} />
		</Stack>
	) : null;
}

function NetworkImage({
	logo,
	imageSize,
}: { logo: string; imageSize: number }): JSX.Element {
	return (
		<UniversalImage
			uri={logo}
			size={{
				width: imageSize,
				height: imageSize,
				resizeMode: UniversalImageResizeMode.Contain,
			}}
		/>
	);
}

export const NetworkLogo = React.memo(_NetworkLogo);

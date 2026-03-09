import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useAppState } from "@/features/essentials/appState";
import { LinearGradient, View } from "@/ui";
import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";
import { useSafeAreaFrame } from "react-native-safe-area-context";

const HEADER_HEIGHT = 275;

type Props = PropsWithChildren<{
	headerContent: ReactElement;
	header: ReactElement;
}>;

export function ParallaxScrollView({ children, header, headerContent }: Props) {
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const isTestnet = useAppState((s) => s.testnetEnabled);
	const scrollOffset = useScrollViewOffset(scrollRef);
	const bottom = useBottomTabOverflow();
	const { height: safeHeight } = useSafeAreaFrame();
	const adjust = bottom + (isTestnet ? 135 : 178);
	const minContentHeight = safeHeight - HEADER_HEIGHT + adjust;
	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[2, 1, 1],
					),
				},
			],
		};
	});

	return (
		<View style={styles.container} bg="$surface1">
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				scrollIndicatorInsets={{ bottom }}
				contentContainerStyle={{ paddingBottom: bottom }}
				showsVerticalScrollIndicator={false}
			>
				<Animated.View style={[styles.header, headerAnimatedStyle]}>
					<LinearGradient
						width="100%"
						height={HEADER_HEIGHT}
						colors={["$surface1", "$surface3"]}
						position="absolute"
					/>
					{header}
					{headerContent}
				</Animated.View>
				<View
					style={{ ...styles.content, minHeight: minContentHeight }}
					bg="$surface1"
				>
					{children}
				</View>
			</Animated.ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		height: HEADER_HEIGHT,
		overflow: "hidden",
		alignItems: "center",
	},
	content: {
		flex: 1,
		flexGrow: 1,
		gap: 16,
		overflow: "hidden",
	},
});

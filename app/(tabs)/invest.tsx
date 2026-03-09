import { StyleSheet } from "react-native";

import { ParallaxScrollView } from "@/components/layout/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { InvestHeader, InvestTabs } from "@/features/investments";
import { Text } from "@/ui";

export default function InvestScreen() {
	return (
		<ParallaxScrollView
			header={<InvestHeader />}
			headerContent={
				<>
					<IconSymbol
						size={310}
						color="#d4d4d4"
						name="chevron.left.forwardslash.chevron.right"
						style={styles.headerImage}
					/>
					<Text
						self="center"
						t={106}
						variant="heading2"
						fontWeight="700"
						color="$neutral2"
					>
						Coming Soon
					</Text>
				</>
			}
		>
			<InvestTabs />
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: "#d4d4d4",
		bottom: -90,
		left: -35,
		position: "absolute",
	},
	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
});

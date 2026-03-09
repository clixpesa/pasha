import { ParallaxScrollView } from "@/components/layout/ParallaxScrollView";
import { SpacesCard, SpacesHeader, SpacesTabs } from "@/features/spaces";
import { useState } from "react";
//import { useNavigationState } from "@react-navigation/native";

export default function SpacesScreen() {
	//const index = useNavigationState((s) => s.routes[s.index].state?.index) || 0
	const [index, setIndex] = useState<number>(0);
	return (
		<ParallaxScrollView
			header={<SpacesHeader index={index} />}
			headerContent={<SpacesCard />}
		>
			<SpacesTabs onTabSelect={({ index }) => setIndex(index)} />
		</ParallaxScrollView>
	);
}

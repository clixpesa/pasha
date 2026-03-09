import { Path, Svg } from "react-native-svg";
import { createIcon } from "../factories/createIcon";

export const [Logout, AnimatedLogout] = createIcon({
	name: "Logout",
	getIcon: (props) => (
		<Svg viewBox="0 0 24 24" fill="none" {...props}>
			<Path
				d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z"
				fill="currentColor"
			/>
		</Svg>
	),
	defaultFill: "#7D7D7D",
});

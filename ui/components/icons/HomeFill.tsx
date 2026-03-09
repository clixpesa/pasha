import { Path, Svg } from "react-native-svg";
import { createIcon } from "../factories/createIcon";

export const [HomeFill, AnimatedHomeFill] = createIcon({
  name: "HomeFill",
  getIcon: (props) => (
    <Svg viewBox="0 0 24 24" fill="none" {...props}>
      <Path 
        d="M20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20ZM8 15V17H16V15H8Z"  
        fill="currentColor"
      />
    </Svg>
  ),
});
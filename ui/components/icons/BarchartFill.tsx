import { Path, Svg } from "react-native-svg";
import { createIcon } from "../factories/createIcon";

export const [BarchartFill, AnimatedBarchartFill] = createIcon({
  name: "BarchartFill",
  getIcon: (props) => (
    <Svg viewBox="0 0 24 24" fill="none" {...props}>
      <Path 
        d="M2 13H8V21H2V13ZM9 3H15V21H9V3ZM16 8H22V21H16V8Z"  
        fill="currentColor"
      />
    </Svg>
  ),
});


export {
	Accordion,
	Anchor,
	AnimatePresence,
	Avatar,
	Circle,
	createTamagui,
	getToken,
	getTokenValue,
	Image,
	Input,
	isTouchable,
	isWeb,
	ListItem,
	Main,
	Nav,
	Paragraph,
	Popover,
	Portal,
	RadioGroup,
	ScrollView,
	Select,
	Sheet,
	Spacer,
	Square,
	Stack,
	styled,
	Tabs,
	Theme,
	useComposedRefs,
	useIsTouchDevice,
	useMedia,
	usePropsAndStyle,
	useWindowDimensions,
	View,
	VisuallyHidden,
	XGroup,
	XStack,
	YGroup,
	YStack,
} from "tamagui";
export type {
	Adapt,
	AnchorProps,
	CircleProps,
	ColorTokens,
	GetProps,
	GetRef,
	GetThemeValueForKey,
	ImageProps,
	InputProps,
	PopperProps,
	SpaceTokens,
	StackProps,
	TabLayout,
	TabsTabProps,
	TamaguiElement,
	TamaguiProviderProps,
	TextStyle,
	ThemeKeys,
	ThemeName,
	Tokens,
	ViewProps,
} from "tamagui";
export {
	LinearGradient,
	type LinearGradientProps,
} from "tamagui/linear-gradient";
export * from "./UIProvider";

//Components
export { Button } from "./components/buttons/Button/Button";
export {
	IconButton,
	type IconButtonProps,
} from "./components/buttons/IconButton/IconButton";
//export * from "./components/buttons/IconButton/PlusMinusButton";
//export * from "./components/input";
//export { QRCodeDisplay } from "./components/QRcode/QRCodeDisplay";
//export { Switch } from "./components/switch/Switch";
export * from "./components/text";
export * from "./components/touchable";
//export { Unicon } from "./components/Unicon";
//export * from "./components/Unicon/utils";
//export * from "./components/UniversalImage/types";
//export * from "./components/UniversalImage/UniversalImage";
//export * from "./components/UniversalImage/utils";

//types
export type {
	ButtonEmphasis,
	ButtonProps,
	ButtonVariant,
} from "./components/buttons/Button/types";
export type {
	GeneratedIcon,
	IconProps,
} from "./components/factories/createIcon";

//Hooks
export { useIsShortMobileDevice } from "./hooks/useIsShortMobileDevice";
export { useThemeColors, type DynamicColor } from "./hooks/useThemeColors";

//Layout
export * from "./components/layout/AnimatedStacks";
export * from "./components/layout/Separator";

//Loaders
//export * from "./components/loading/ActivityLoader";
//export * from "./components/loading/FlexLoader";
//export * from "./components/loading/Loader";
//export * from "./components/loading/NftCardLoader";
export * from "./components/loading/Shine";
export * from "./components/loading/Skeleton";
export * from "./components/loading/SpinningLoader";
//export * from "./components/loading/TransactionLoader";

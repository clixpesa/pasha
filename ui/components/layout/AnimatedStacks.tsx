import Animated from "react-native-reanimated";
import { Stack, XStack, YStack } from "tamagui";

export const AnimatedStack = Animated.createAnimatedComponent(Stack);
export const AnimatedXStack = Animated.createAnimatedComponent(XStack);
export const AnimatedYStack = Animated.createAnimatedComponent(YStack);

AnimatedStack.displayName = "AnimatedStack";
AnimatedXStack.displayName = "AnimatedXStack";
AnimatedYStack.displayName = "AnimatedYStack";

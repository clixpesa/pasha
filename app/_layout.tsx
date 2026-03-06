import { useFonts } from "expo-font";
import { store } from "@/store/redux";
import { UIProvider, useThemeColors } from "@/ui";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { Text } from "@/ui"

export default function RootLayout() {
  const [loaded] = useFonts({
		SpaceMono: require("@/ui/assets/fonts/SpaceMono-Regular.ttf"),
		InputMono: require("@/ui/assets/fonts/InputMono-Regular.ttf"),
		InterBold: require("@/ui/assets/fonts/Inter-Bold.ttf"),
		InterMedium: require("@/ui/assets/fonts/Inter-Medium.ttf"),
		InterRegular: require("@/ui/assets/fonts/Inter-Regular.ttf"),
		InterSemiBold: require("@/ui/assets/fonts/Inter-SemiBold.ttf"),
	});

  if (!loaded) {
		// Async font loading only occurs in development.
		return null;
	}
  
  return (
		//<StrictMode>
		<SafeAreaProvider>
			<UIProvider>
				<AppOuter />
			</UIProvider>
		</SafeAreaProvider>
		//</StrictMode>
	);
}

function AppOuter(): React.JSX.Element | null {
	return (
		<Provider store={store}>
			<GestureHandlerRootView>
				<BottomSheetModalProvider>
					<AppInner />
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</Provider>
	);
}

function AppInner(): React.JSX.Element {
	const colors = useThemeColors();
  return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background.val }}>
      <Text>This is the first page</Text>
		</SafeAreaView>
	);
}
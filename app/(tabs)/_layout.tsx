import { useThemeColors } from "@/ui";
import { fonts } from "@/ui/theme/fonts";
import {
	type NativeBottomTabNavigationEventMap,
	type NativeBottomTabNavigationOptions,
	createNativeBottomTabNavigator,
} from "@bottom-tabs/react-navigation";
import type {
	ParamListBase,
	TabNavigationState,
} from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import React from "react";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
	NativeBottomTabNavigationOptions,
	typeof BottomTabNavigator,
	TabNavigationState<ParamListBase>,
	NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function TabLayout() {
	const colors = useThemeColors();
	return (
		//<KeyboardAvoidingView style={{ flex: 1 }}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}>
		<Tabs
			tabBarStyle={{
				backgroundColor: colors.background.val,
			}}
			labeled={true}
			activeIndicatorColor={colors.tealThemed.val}
			tabBarActiveTintColor={colors.accent1.val}
			translucent={true}
			tabLabelStyle={{
				fontFamily: fonts.buttonLabel2.family,
				fontSize: 14,
				fontWeight: "700",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) =>
						focused
							? require("@/ui/assets/images/nav-icons/home-fill.svg")
							: require("@/ui/assets/images/nav-icons/home-line.svg"),
				}}
			/>
			<Tabs.Screen
				name="spaces"
				options={{
					title: "Spaces",
					tabBarIcon: ({ focused }) =>
						focused
							? require("@/ui/assets/images/nav-icons/bubble-fill.svg")
							: require("@/ui/assets/images/nav-icons/bubble-line.svg"),
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: "Account",
					tabBarIcon: ({ focused }) =>
						focused
							? require("@/ui/assets/images/nav-icons/user-fill.svg")
							: require("@/ui/assets/images/nav-icons/user-line.svg"),
				}}
			/>
			<Tabs.Screen
				name="invest"
				options={{
					title: "Invest",
					tabBarIcon: ({ focused }) => (focused ? 
						require("@/ui/assets/images/nav-icons/barchart-fill.svg") : 
						require("@/ui/assets/images/nav-icons/barchart-line.svg")
					),
				}}
			/>
			{/*<Tabs.Screen
				name="extras"
				options={{
					title: "Extras",
					tabBarIcon: ({ focused }) => (focused ? 
						require("@/ui/assets/images/nav-icons/pantone-fill.svg") : 
						require("@/ui/assets/images/nav-icons/pantone-line.svg")
					),
				}}
			/>*/}
		</Tabs>
		//</KeyboardAvoidingView>
	);
}


/*export default function TabLayout() {
	const colors = useThemeColors();
  return (
    <NativeTabs 
    labelStyle={{
      fontFamily: fonts.buttonLabel2.family,
      fontSize: 12,
      fontWeight: "600"
    }}
    tintColor={colors.accent1.val}
    indicatorColor={colors.tealThemed.val}
    iconColor={colors.neutral2.val}
    backgroundColor={colors.background.val}
    labelVisibilityMode="labeled"
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon src={{ 
          default: require("@/ui/assets/images/nav-icons/home-fill.svg"), 
          selected: require("@/ui/assets/images/nav-icons/home-line.svg")
        }}/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="spaces" >
        <Label>Spaces</Label>
        <Icon src={{
          default: require("@/ui/assets/images/nav-icons/bubble-fill.svg"),
          selected: require("@/ui/assets/images/nav-icons/bubble-line.svg")
        }}/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="invest" >
        <Label>Invest</Label>
        <Icon src={{
          default: require("@/ui/assets/images/nav-icons/barchart-fill.svg"),
          selected: require("@/ui/assets/images/nav-icons/barchart-line.svg")
        }}/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account" >
        <Label>Account</Label>
        <Icon src={{
          default: require("@/ui/assets/images/nav-icons/user-fill.svg"),
          selected: require("@/ui/assets/images/nav-icons/user-line.svg")
        }}/>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}*/
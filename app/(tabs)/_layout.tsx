import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { fonts } from "@/ui/theme/fonts";
import { useThemeColors } from "@/ui";

export default function TabLayout() {
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
}
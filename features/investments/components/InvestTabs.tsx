import { Text, useThemeColors, View } from "@/ui";
import { fonts } from "@/ui/theme/fonts";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function DummyScreen() {
  return (  
    <View flex={1} items="center" justify="center" bg="$surface1">
      <Text>Tab Page</Text>
      <Text color="$neutral2">Tab Content</Text>
    </View>
  );
}

export function InvestTabs(){
  const colors = useThemeColors()
  return(
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { textTransform: 'none', fontSize: 18,  fontFamily: fonts.buttonLabel1.family},
        tabBarActiveTintColor: colors.neutral1.val,
        tabBarIndicatorStyle: {
          borderBottomWidth: 4,        
          borderColor: colors.accent1.val,
          borderRadius: 99999,
          width: "40%",
          marginHorizontal: "5%",
        },
        tabBarStyle: {
          width: "auto",
          elevation: 0
        },
        tabBarPressColor: colors.surface1.val
    }}
    >
      <Tab.Screen name='overview' component={DummyScreen} options={{ tabBarLabel: 'Overview' }}/>
      <Tab.Screen name='portfolio' component={DummyScreen} options={{ tabBarLabel: 'Portfolio' }}/>
    </Tab.Navigator>
  )
}
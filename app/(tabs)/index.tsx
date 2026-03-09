import { Text, View} from "@/ui"
import { useAppState } from "@/features/essentials/appState";
export default function HomeScreen(){
  const user = useAppState((s) => s.user);
  console.log(user)
  return(
    <View flex={1} items="center" bg="$surface1">
      <Text>Home Screen</Text>
    </View>
  )
}
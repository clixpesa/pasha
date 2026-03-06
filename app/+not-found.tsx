import { Text, View } from "@/ui"
import { Link} from "expo-router"

export default function LandingScreen() {
  return (
    <View flex={1} justify="center" items="center">
      <Text>This screen does not exist.</Text>
      <Link href="/" >
        <Text>Landing Page</Text>
      </Link>
    </View>
  )
}

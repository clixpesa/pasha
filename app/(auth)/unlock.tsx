import { useAppState } from "@/features/essentials/appState"
import { Button, Text, View } from "@/ui"
import { router } from "expo-router"

export default function LockScreen() {
  const setIsUnlocked = useAppState((s) => s.setIsUnlocked)
  return (
    <View flex={1} justify="center" items="center" bg="$surface1">
      <Text>Lock Screen</Text>
      <Button 
        onPress={() => {
          setIsUnlocked(true), 
          router.replace("/")
          }
        } 
        variant="branded"
      >
        Unlock App
      </Button>
    </View>
  )
}

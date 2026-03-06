import { Text } from '@/ui/components/text'
import { GradientTextProps } from '@/ui/components/text/GradientText'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'tamagui/linear-gradient'

export function GradientText({ gradient, children, ...props }: GradientTextProps): JSX.Element {
  return (
    <MaskedView maskElement={<Text {...props}>{children}</Text>}>
      <LinearGradient {...gradient}>
        <Text {...props} opacity={0}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  )
}

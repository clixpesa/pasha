import { HiddenFromScreenReadersProps } from '@/ui/components/text/HiddenFromScreenReaders'
import { View } from 'react-native'

export function HiddenFromScreenReaders({ children, style }: HiddenFromScreenReadersProps): JSX.Element {
  return (
    <View accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants" style={style}>
      {children}
    </View>
  )
}

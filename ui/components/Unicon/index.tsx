import { useSelectedColorScheme } from "@/ui/themeStore"
import { isAddress } from '@/utilities/addresses'
import { Canvas, Circle, Group, Path } from '@shopify/react-native-skia'
import { memo } from 'react'
import { View } from 'tamagui'
import { IconPaths, Icons } from './UniconSVGs'
import { UniconProps } from './types'
import { getUniconColors, getUniconsDeterministicHash } from './utils'

// Notes:
// Add 1 to effectively increase margin between svg and surrounding box, otherwise get a cropping issue
// Magic numbers to make SVG with border look right - makes the margin larger, and shifts the SVG down and right

export const Unicon = memo(_Unicon)

export function _Unicon({ address, size = 32 }: UniconProps): JSX.Element | null {
  const selectedTheme = useSelectedColorScheme()
  const isDarkMode = selectedTheme === "dark"

  if (!address || !isAddress(address)) {
    return null
  }

  const hashValue = getUniconsDeterministicHash(address)
  const { color } = getUniconColors(address, isDarkMode)

  const iconKeys = Object.keys(Icons)
  if (iconKeys.length === 0) {
    throw new Error('No icons available')
  }

  const iconIndex = Math.abs(Number(hashValue)) % iconKeys.length
  const selectedIconKey = iconKeys[iconIndex] as keyof typeof Icons
  const selectedIconPaths: IconPaths | undefined = Icons[selectedIconKey]

  if (!selectedIconPaths) {
    throw new Error(`No icon found for key: ${String(selectedIconKey)}`)
  }

  const ORIGINAL_CONTAINER_SIZE = 48

  const scaleValue = size / ORIGINAL_CONTAINER_SIZE / 1.5
  const scaledSVGSize = ORIGINAL_CONTAINER_SIZE * scaleValue
  const translateAmount = (size - scaledSVGSize) / 2

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        <Circle color={color + `${isDarkMode ? '29' : '1F'}`} cx={size / 2} cy={size / 2} r={size / 2} />
        <Group transform={[{ translateX: translateAmount }, { translateY: translateAmount }]}>
          <Group transform={[{ scale: scaleValue }]}>
            {/* This is the shape generation code */}
            {selectedIconPaths.map((pathData: string, index: number) => (
              <Path
                key={index.toString()}
                clip-rule="evenodd"
                color={color}
                fillType="evenOdd"
                path={pathData}
                strokeWidth={1}
              />
            ))}
          </Group>
        </Group>
      </Canvas>
    </View>
  )
}

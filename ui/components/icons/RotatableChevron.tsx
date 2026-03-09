import { IconProps } from '@/ui/components/factories/createIcon'
import { memo } from 'react'
import { I18nManager } from 'react-native'
import { ColorTokens, Stack, StackProps } from 'tamagui'
import { Chevron } from './Chevron'

type Props = {
  width?: string | number
  height?: string | number
  direction?: 'up' | 'right' | 'down' | 'left' | 'start' | 'end'
  color?: ColorTokens
} & Omit<StackProps, 'direction' | '$group-hover'> &
  Pick<IconProps, '$group-hover'>

function _RotatableChevron({
  color,
  width = 24,
  height = 24,
  direction = 'start',
  animation = 'fast',
  '$group-hover': $groupItemHover,
  ...rest
}: Props): JSX.Element {
  let degree: string
  switch (direction) {
    case 'start':
      degree = I18nManager.isRTL ? '180deg' : '0deg'
      break
    case 'end':
      degree = I18nManager.isRTL ? '0deg' : '180deg'
      break
    case 'up':
      degree = '90deg'
      break
    case 'right':
      degree = '180deg'
      break
    case 'down':
      degree = '270deg'
      break
    case 'left':
    default:
      degree = '0deg'
      break
  }

  return (
    <Stack items="center" rounded="$full" rotate={degree} animation={animation} {...rest}>
      {/* @ts-expect-error TODO(MOB-1570) this works but we should migrate to size prop */}
      <Chevron $group-hover={$groupItemHover} color={color} height={height} width={width} />
    </Stack>
  )
}
export const RotatableChevron = memo(_RotatableChevron)

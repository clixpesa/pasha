import type { GetProps } from 'tamagui'
import { TouchableAreaFrame } from './TouchableAreaFrame'

type TouchableAreaFrameProps = GetProps<typeof TouchableAreaFrame>

type Variant = TouchableAreaFrameProps['variant']

type TouchableAreaExtraProps = {
  // If true, the touchable area will resize itself to fit minimum dimensions defined by accessibility guidelines
  // defaults to undefined for backwards compatibility with previous versions of the TouchableArea component
  shouldConsiderMinimumDimensions?: boolean
  scaleTo?: number
  activeOpacity?: number
  /**
   * If true, calls event.stopPropagation() on press events to prevent bubbling to parent touchables.
   * Works on both web and React Native (where supported).
   */
  shouldStopPropagation?: boolean
}

// All variants except 'raised'
type NonRaisedProps = TouchableAreaExtraProps &
  Omit<TouchableAreaFrameProps, 'variant' | 'bg'> & {
    variant?: Exclude<Variant, 'raised'>
    bg?: TouchableAreaFrameProps['bg']
  }

// 'raised' variant requires backgroundColor
type RaisedProps = TouchableAreaExtraProps &
  Omit<TouchableAreaFrameProps, 'variant' | 'bg'> & {
    variant: Extract<Variant, 'raised'>
    bg: NonNullable<TouchableAreaFrameProps['bg']>
  }

export type TouchableAreaProps = NonRaisedProps | RaisedProps

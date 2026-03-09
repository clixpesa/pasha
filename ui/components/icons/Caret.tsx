import { withAnimated } from '@/ui/components/factories/animated'
import { ArrowChange } from '@/ui/components/icons/ArrowChange'
import { memo } from 'react'

type Props = {
  size?: number
  direction?: 'n' | 's'
  color?: string
}

export function _Caret({ size = 24, color, direction = 'n' }: Props): JSX.Element {
  let degree: string
  switch (direction) {
    case 's':
      degree = '0deg'
      break
    case 'n':
      degree = '180deg'
      break
    default:
      throw new Error(`Invalid arrow direction ${direction}`)
  }

  return <ArrowChange color={color ?? '$black'} size={size} strokeWidth={2} rotate={degree} />
}

export const Caret = memo(_Caret)

export const AnimatedCaretChange = withAnimated(ArrowChange)

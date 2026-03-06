import { useEvent } from '@/utilities/react/hooks'
import { useMemo } from 'react'
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { errorShakeAnimation } from '../errorShakeAnimation'

export interface ShakeAnimation {
  shakeStyle: ReturnType<typeof useAnimatedStyle>
  triggerShakeAnimation: () => void
}

export const useShakeAnimation = (): ShakeAnimation => {
  const shakeValue = useSharedValue(0)
  const shakeStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: shakeValue.value }],
    }),
    [shakeValue.value],
  )

  const triggerShakeAnimation = useEvent(() => {
    shakeValue.value = errorShakeAnimation(shakeValue)
  })

  return useMemo(
    () => ({
      shakeStyle,
      triggerShakeAnimation,
    }),
    [shakeStyle, triggerShakeAnimation],
  )
}

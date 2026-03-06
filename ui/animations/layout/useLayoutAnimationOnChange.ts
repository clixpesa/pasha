import { useHasValueChanged } from '@/utilities/react/useHasValueChanged'
import { easeInEaseOutLayoutAnimation } from './layoutAnimation'

export function useLayoutAnimationOnChange<ValueType>(
  value: ValueType,
  options?: Parameters<typeof easeInEaseOutLayoutAnimation>[0],
): undefined {
  const hasValueChanged = useHasValueChanged(value)

  if (hasValueChanged) {
    easeInEaseOutLayoutAnimation(options)
  }
}

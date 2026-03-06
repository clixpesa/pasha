import { usePreviousWithLayoutEffect } from './usePreviousWithLayoutEffect'

export function useHasValueChanged<ValueType>(value: ValueType): boolean {
  const prevValue = usePreviousWithLayoutEffect(value)

  return prevValue !== value
}

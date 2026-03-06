import { useLayoutAnimationOnChange } from '@/ui/animations'

export const useButtonAnimationOnChange = ({
  shouldAnimateBetweenLoadingStates,
  loading,
}: {
  shouldAnimateBetweenLoadingStates?: boolean
  loading?: boolean
}): void => {
  useLayoutAnimationOnChange(shouldAnimateBetweenLoadingStates && loading)
}

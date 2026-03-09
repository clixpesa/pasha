import { SpinningLoader } from '@/ui/components/loading/SpinningLoader'
import type { JSX } from 'react'
import { useStyle } from 'tamagui'
import { useIconSizes } from '../hooks/useIconSizes'
import type { ButtonVariantProps, TypeOfButton } from '../types'
import { CustomButtonText } from './CustomButtonText/CustomButtonText'

type ThemedSpinningLoaderProps = Pick<ButtonVariantProps, 'size' | 'variant' | 'emphasis' | 'isDisabled'> & {
  typeOfButton: TypeOfButton
}

export const ThemedSpinningLoader = ({
  size = 'md',
  variant,
  emphasis,
  isDisabled,
  typeOfButton,
}: ThemedSpinningLoaderProps): JSX.Element => {
  const iconSizes = useIconSizes(typeOfButton)
  // @ts-expect-error we know the color will be there; deficiency in tamagui's types
  // TODO: possibly look into this as a performance bottleneck (refer to typedef for more info)
  const { color } = useStyle({ variant, emphasis, isDisabled }, { forComponent: CustomButtonText })
  const loaderSize = iconSizes[size]

  return <SpinningLoader unstyled color={color} size={loaderSize} />
}

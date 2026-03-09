import { cloneElement, JSX, memo } from 'react'
import { useStyle } from 'tamagui'
import { useIconSizes } from '../hooks/useIconSizes'
import { ButtonVariantProps, TypeOfButton } from '../types'
import { CustomButtonText } from './CustomButtonText/CustomButtonText'

export type ThemedIconProps = ButtonVariantProps & {
  typeOfButton: TypeOfButton
  children?: JSX.Element
}

/* Note: This will only pass the themed props to the component that is a direct child
 * If this is an icon created by `createIcon`, great
 * Otherwise, if there's a wrapper, the wrapper will need to pass the props down to the icon created by `createIcon`
 */
const ThemedIcon_ = ({
  children,
  size = 'md',
  variant,
  isDisabled,
  emphasis,
  typeOfButton,
  'custom-bg': customBackgroundColor,
}: ThemedIconProps): JSX.Element | null => {
  const iconSizes = useIconSizes(typeOfButton)

  // @ts-expect-error we know the color will be there; deficiency in tamagui's types
  // TODO: possibly look into this as a performance bottleneck (refer to typedef for more info)
  const { color, '$group-hover': groupItemHover } = useStyle(
    { variant, emphasis, isDisabled, 'custom-bg': customBackgroundColor },
    {
      forComponent: CustomButtonText,
    },
  )

  if (!children) {
    return null
  }

  const finalGroupItemHover = children.props?.['$group-hover'] ?? groupItemHover

  const width = iconSizes[size]
  const height = width

  return cloneElement(children, {
    color: children.props?.color ?? color,
    width,
    height,
    '$group-hover': finalGroupItemHover,
  })
}

const ThemedIcon = memo(ThemedIcon_)

export { ThemedIcon }

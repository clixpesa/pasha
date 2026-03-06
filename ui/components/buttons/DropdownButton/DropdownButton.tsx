import type { IconProps } from '@/ui/components/factories/createIcon'
import { RotatableChevron } from '@/ui/components/icons'
import { Flex } from '@/ui/components/layout/Flex'
import { cloneElement, forwardRef, Fragment, useMemo } from 'react'
import type { TamaguiElement } from 'tamagui'
import { withStaticProperties } from 'tamagui'
import { ThemedIcon } from '../Button/components/ThemedIcon'
import { useIsStringOrTransTag } from '../Button/hooks/useIsStringOrTransTag'
import { getIconPosition } from '../Button/utils/getIconPosition'
import { getIsButtonDisabled } from '../Button/utils/getIsButtonDisabled'
import { EXPANDED_COLOR, EXPANDED_HOVER_COLOR } from './constants'
import { DropdownButtonFrame } from './DropdownButtonFrame'
import { DropdownButtonText } from './DropdownButtonText'
import type { DropdownButtonProps } from './types'

type LeftContainerProps = Pick<DropdownButtonProps, 'elementPositioning' | 'children' | 'icon'> & {
  label: DropdownButtonProps['children']
}

const LeftContainer = ({ elementPositioning, children, icon, label }: LeftContainerProps): JSX.Element => {
  if (elementPositioning === 'grouped' && icon && label) {
    return (
      <Flex row items="center" gap="$sm">
        {children}
      </Flex>
    )
  }

  return <Fragment>{children}</Fragment>
}

const DropdownButtonComponent = forwardRef<TamaguiElement, DropdownButtonProps>(function DropdownButton(
  { children, emphasis = 'secondary', icon, isDisabled, elementPositioning = 'equal', isExpanded, ...props },
  ref,
) {
  const disabled = getIsButtonDisabled({ isDisabled, loading: undefined })
  const isStringOrTransTag = useIsStringOrTransTag(children)

  /* When a `dropdownSelector` has an icon and text (children), we need to add a flexGrow={1} to the Flex to make sure the icon, text, and right chevron are equally spaced */
  const SpacingElement = useMemo(() => {
    return elementPositioning !== 'grouped' && icon && children ? <Flex flex={1} /> : null
  }, [elementPositioning, icon, children])

  const iconGroupItemHover: IconProps['$group-hover'] = useMemo(
    () =>
      isExpanded
        ? {
            color: EXPANDED_HOVER_COLOR,
          }
        : undefined,
    [isExpanded],
  )
  const iconColor = isExpanded ? EXPANDED_COLOR : undefined

  return (
    <DropdownButtonFrame
      ref={ref}
      iconPosition={getIconPosition('before')}
      emphasis={emphasis}
      isDisabled={disabled}
      isExpanded={isExpanded}
      {...props}
    >
      <LeftContainer icon={icon} elementPositioning={elementPositioning} label={children}>
        <ThemedIcon
          isDisabled={isDisabled}
          emphasis={emphasis}
          size={props.size}
          variant="default"
          typeOfButton="button"
        >
          {icon
            ? cloneElement(icon, {
                color: iconColor,
                '$group-hover': iconGroupItemHover,
              })
            : undefined}
        </ThemedIcon>
        {SpacingElement}

        {isStringOrTransTag ? <DropdownButtonText>{children}</DropdownButtonText> : children}
      </LeftContainer>

      {SpacingElement}

      <ThemedIcon isDisabled={isDisabled} emphasis={emphasis} size={props.size} variant="default" typeOfButton="button">
        <RotatableChevron
          color={iconColor}
          animation="fast"
          direction={isExpanded ? 'up' : 'down'}
          $group-item-hover={iconGroupItemHover}
        />
      </ThemedIcon>
    </DropdownButtonFrame>
  )
})

/**
 * A dropdown button component that can be used to select an option from a dropdown menu.
 *
 * @param {DropdownButtonProps} props - The props for the `DropdownButton` component.
 * @param {ReactNode} props.children - The content of the button.
 * @param {ButtonEmphasis} props.emphasis - The `Button` emphasis.
 * @param {ReactNode} props.icon - The icon of the button.
 * @param {ElementPositioning} props.elementPositioning - When there are both `icon` and `children`, 'grouped' will group them together on the left side of the button's container.
 * @param {boolean} props.isExpanded - Whether the button is expanded.
 */
export const DropdownButton = withStaticProperties(DropdownButtonComponent, {
  Text: DropdownButtonText,
  Icon: ThemedIcon,
  Chevron: RotatableChevron,
})

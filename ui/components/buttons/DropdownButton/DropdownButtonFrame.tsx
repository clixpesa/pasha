import { styled } from 'tamagui'
import { CustomButtonFrame } from '../Button/components/CustomButtonFrame/CustomButtonFrame'
import { dropdownButtonStyledContext } from './constants'

export const DropdownButtonFrame = styled(CustomButtonFrame, {
  context: dropdownButtonStyledContext,
  variant: 'default',
  justify: 'space-between',
  variants: {
    isExpanded: {
      true: {},
      false: {},
    },
    emphasis: {
      secondary: (_, { props }) => {
        // @ts-expect-error we know isExpanded will be DropdownButtonProps['isExpanded']
        const isExpanded = props.isExpanded as DropdownButtonProps['isExpanded']

        if (!isExpanded) {
          return {}
        }

        return {
          bg: '$transparent',
          borderColor: '$surface3',
          hoverStyle: {
            borderColor: '$surface3Hovered',
            bg: '$transparent',
          },
        }
      },
      tertiary: (_, { props }) => {
        // @ts-expect-error we know isExpanded will be DropdownButtonProps['isExpanded']
        const isExpanded = props.isExpanded as DropdownButtonProps['isExpanded']

        if (!isExpanded) {
          return {}
        }

        return {
          bg: '$transparent',
        }
      },
      'text-only': (_, { props }) => {
        // @ts-expect-error we know isExpanded will be DropdownButtonProps['isExpanded']
        const isExpanded = props.isExpanded as DropdownButtonProps['isExpanded']

        if (!isExpanded) {
          return {}
        }

        return {
          bg: '$transparent',
        }
      },
    },
    elementPositioning: {
      equal: {},
      grouped: {},
    },
  } as const,
})

DropdownButtonFrame.displayName = 'DropdownButtonFrame'

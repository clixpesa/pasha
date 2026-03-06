import { styled } from 'tamagui'
import { CustomButtonText } from '../Button/components/CustomButtonText/CustomButtonText'
import {
  dropdownButtonStyledContext,
  EXPANDED_COLOR,
  EXPANDED_HOVER_COLOR,
} from './constants'

export const DropdownButtonText = styled(CustomButtonText, {
  context: dropdownButtonStyledContext,
  variants: {
    isExpanded: {
      true: {
        color: EXPANDED_COLOR,
        hoverStyle: {
          color: EXPANDED_HOVER_COLOR,
        },
        '$group-hover': {
          color: EXPANDED_HOVER_COLOR,
        },
      },
    },
  } as const,
})

DropdownButtonText.displayName = 'DropdownButtonText'

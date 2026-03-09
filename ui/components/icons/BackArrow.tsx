import { GeneratedIconProps } from '@/ui/components/factories/createIcon'
import { I18nManager } from 'react-native'
import { LeftArrow } from './LeftArrow'
import { RightArrow } from "./RightArrow"

export function BackArrow(props: GeneratedIconProps): JSX.Element {
  return I18nManager.isRTL ? <RightArrow size={24} {...props} /> : <LeftArrow size={24} {...props} />
}

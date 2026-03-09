import { IconProps } from '@/ui/components/factories/createIcon'
import { memo } from 'react'
import { Platform } from 'react-native'
import { Cloud } from './Cloud'
import { GoogleDrive } from './GoogleDrive'

function _OSDynamicCloudIcon(iconProps: IconProps): JSX.Element {
  if (Platform.OS === 'ios') {
    return <Cloud {...iconProps} />
  } else {
    return <GoogleDrive {...iconProps} />
  }
}

export const OSDynamicCloudIcon = memo(_OSDynamicCloudIcon)

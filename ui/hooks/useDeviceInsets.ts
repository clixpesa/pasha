import { PlatformSplitStubError } from '@/utilities/errors'
import type { EdgeInsets } from 'react-native-safe-area-context'

export function useDeviceInsets(): EdgeInsets {
  throw new PlatformSplitStubError('useDeviceInsets')
}

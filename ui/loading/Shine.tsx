import type { ShineProps } from '@/ui/loading/ShineProps'
import { PlatformSplitStubError } from '@/utilities/errors'

export function Shine(_props: ShineProps): JSX.Element {
  throw new PlatformSplitStubError('Shine')
}

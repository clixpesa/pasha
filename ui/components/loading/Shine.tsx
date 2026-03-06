import type { ShineProps } from '@/ui/components/loading/ShineProps'
import { PlatformSplitStubError } from '@/utilities/errors'

export function Shine(_props: ShineProps): JSX.Element {
  throw new PlatformSplitStubError('Shine')
}

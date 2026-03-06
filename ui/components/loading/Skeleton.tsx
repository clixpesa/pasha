import { SkeletonProps } from '@/ui/components/loading/SkeletonProps'
import { PlatformSplitStubError } from '@/utilities/errors'

export function Skeleton(_props: SkeletonProps): JSX.Element {
  throw new PlatformSplitStubError('Skeleton')
}

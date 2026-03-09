import { PlatformSplitStubError } from '@/utilities/errors'
import { PlainImageProps } from '../types'

export function PlainImage(_props: PlainImageProps): JSX.Element {
  throw new PlatformSplitStubError('PlainImage')
}

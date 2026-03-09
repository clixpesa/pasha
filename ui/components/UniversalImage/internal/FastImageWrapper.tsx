import { FastImageWrapperProps } from '../types'
import { PlainImage } from './PlainImage'

// For web, fall back to plain image
export function FastImageWrapper({ setError: _, ...rest }: FastImageWrapperProps): JSX.Element | null {
  return <PlainImage {...rest} />
}

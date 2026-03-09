import { Stack } from 'tamagui'
import { SvgImageProps } from '../types'
import { useSvgData } from '../utils'
import { PlainImage } from './PlainImage'

export function SvgImage({ uri, size, autoplay, fallback }: SvgImageProps): JSX.Element | null {
  const svgData = useSvgData(uri, autoplay)

  if (!svgData?.content || !svgData?.aspectRatio) {
    return fallback ?? <Stack />
  }

  // Since this would violate HTTP CSP for images to use the direct data
  // from a fetch call, we use plain image for SVG's on web
  return <PlainImage fallback={fallback} size={size} uri={uri} />
}

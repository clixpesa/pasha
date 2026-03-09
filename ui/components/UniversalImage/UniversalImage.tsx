/* eslint-disable complexity */
import { Loader } from '@/ui/components/loading/Loader'
import { isSVGUri, uriToHttpUrls } from '@/utilities/format/urls'
import { logger } from '@/utilities/logger/logger'
import { useEffect, useState } from 'react'
import { ColorTokens, Image, Stack } from 'tamagui'
import { FastImageWrapper } from './internal/FastImageWrapper'
import { PlainImage } from './internal/PlainImage'
import { SvgImage } from './internal/SvgImage'
import { UniversalImageProps, UniversalImageSize } from './types'

const LOADING_FALLBACK = <Loader.Image />

export function UniversalImage({
  uri,
  size,
  style,
  fallback,
  fastImage = false,
  testID,
  onLoad,
  allowLocalUri = false,
  autoplay = true,
}: UniversalImageProps): JSX.Element | null {
  // Allow calculation of fields as needed
  const [width, setWidth] = useState(size.width)
  const [height, setHeight] = useState(size.height)
  const computedSize: UniversalImageSize = { width, height, aspectRatio: size.aspectRatio }

  const [errored, setErrored] = useState(false)

  const hasWidthAndHeight = computedSize.width !== undefined && computedSize.height !== undefined
  const hasHeightAndRatio = computedSize.height !== undefined && computedSize.aspectRatio !== undefined
  const sizeKnown = hasWidthAndHeight || hasHeightAndRatio

  const isRequireSource = typeof uri === 'number'

  // Propagate prop updates to state
  useEffect(() => {
    setWidth(size.width)
    setHeight(size.height)
  }, [size.height, size.width])

  // Calculate width/height and check for an error in the image retrieval for fast images
  useEffect(() => {
    // If we know dimension or this isn't a fast image, skip calculating width/height
    if (!uri || sizeKnown || !fastImage || isRequireSource) {
      return
    }

    // Calculate size if not enough info is given
    Image.getSize(
      uri,
      (calculatedWidth: number, calculatedHeight: number) => {
        setWidth(calculatedWidth)
        setHeight(calculatedHeight)
      },
      () => setErrored(true),
    )
  }, [width, height, sizeKnown, uri, fastImage, isRequireSource])

  // Handle local URI
  if (isRequireSource) {
    return <Image height={size.height} source={uri} width={size.width} />
  }

  // Use the fallback if no URI at all
  if (!uri && fallback) {
    return fallback
  }

  // Show a loader while the URI is populating or size is calculating when there's no fallback
  if (!uri || (!sizeKnown && !errored)) {
    if (style?.loadingContainer) {
      return <Stack style={style?.loadingContainer}>{LOADING_FALLBACK}</Stack>
    }
    return LOADING_FALLBACK
  }

  // Get the sanitized url
  const imageHttpUrl = uriToHttpUrls(uri, { allowLocalUri })[0]

  // Log an error and show a fallback (or null) when the URI is bad or an error loading occurs
  if (!imageHttpUrl || errored) {
    const errMsg = errored
      ? 'could not compute sizing information for uri'
      : 'Could not retrieve and format remote image for uri'
    logger.warn('UniversalImage', 'UniversalImage', errMsg, { data: uri })

    // Return fallback or null
    return fallback ?? null
  }

  // Handle images requested to use fast image
  if (fastImage && sizeKnown) {
    return (
      <FastImageWrapper
        setError={() => setErrored(true)}
        size={computedSize}
        testID={testID ? `svg-${testID}` : undefined}
        uri={uri}
      />
    )
  }

  // Handle any svg separate from plain images
  if (isSVGUri(imageHttpUrl)) {
    return (
      <Stack
        items="center"
        bg={style?.image?.backgroundColor as ColorTokens}
        rounded={style?.image?.borderRadius}
        verticalAlign={style?.image?.verticalAlign}
        height={size.height}
        overflow="hidden"
        testID={testID ? `svg-${testID}` : undefined}
        width={size.width}
      >
        <SvgImage autoplay={autoplay} fallback={fallback} size={size} uri={imageHttpUrl} />
      </Stack>
    )
  }

  // Handle a plain image
  return (
    <PlainImage
      fallback={fallback}
      resizeMode={size.resizeMode}
      size={computedSize}
      style={style?.image}
      testID={testID ? `img-${testID}` : undefined}
      uri={imageHttpUrl}
      onLoad={onLoad}
    />
  )
}

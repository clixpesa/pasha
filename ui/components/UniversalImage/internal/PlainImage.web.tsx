import { useState } from 'react'
import { PlainImageProps, UniversalImageResizeMode } from '../types'

export function PlainImage({ uri, size, fallback, resizeMode, style, testID, onLoad }: PlainImageProps): JSX.Element {
  const [hasError, setHasError] = useState(false)

  // TODO cover all cases better
  const objectFit =
    resizeMode === UniversalImageResizeMode.Contain || resizeMode === UniversalImageResizeMode.Cover
      ? resizeMode
      : 'contain'

  const imgElement = (
    <img
      height={size.height}
      src={uri}
      style={{ objectFit, aspectRatio: size.aspectRatio, ...style }}
      width={size.width}
      onError={() => {
        setHasError(true)
      }}
      onLoad={onLoad}
    />
  )

  if (hasError && fallback) {
    return fallback
  }
    return imgElement
  }


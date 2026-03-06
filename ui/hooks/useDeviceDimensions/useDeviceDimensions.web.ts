import { breakpoints } from '@tamagui/config/v4'
import { useEffect, useState } from 'react'
import type { DeviceDimensions } from './useDeviceDimensions'

const isClient = typeof window === 'object'

function getDeviceDimensions(): DeviceDimensions {
  return {
    fullHeight: window.innerHeight,
    fullWidth: window.innerWidth,
  }
}

// based on https://usehooks.com/useWindowSize/
// Additional logic added to handle getting the extension window size
export const useDeviceDimensions = (): DeviceDimensions => {
  const [deviceDimensions, setDeviceDimensions] = useState(getDeviceDimensions)

  // handles interface resize
  useEffect(() => {
    function handleResize(): void {
      setDeviceDimensions(getDeviceDimensions())
    }

    if (!isClient) {
      return undefined
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return deviceDimensions
}

export const useIsExtraLargeScreen = (): boolean => {
  const { fullWidth } = useDeviceDimensions()
  return fullWidth >= breakpoints.xl
}

import { ColorTokens, Stack, StackProps, Unicon, UniversalImage, UniversalImageResizeMode } from '@/ui'
import { Eye } from '@/ui/components/icons'

// Determines view only icon size in relation to Account Icon size
const EYE_ICON_SCALING_FACTOR = 0.4

interface AccountIconProps {
  size: number
  showViewOnlyBadge?: boolean
  address: string
  avatarUri?: string | null
  showBackground?: boolean // Display images with solid background.
  showBorder?: boolean // Display border stroke around image
  borderWidth?: StackProps['borderWidth']
  borderColor?: ColorTokens
}

export function AccountIcon({
  size,
  showViewOnlyBadge,
  address,
  avatarUri,
  showBackground,
  showBorder,
  borderColor = '$surface1',
  borderWidth = "$3xs",
}: AccountIconProps): JSX.Element {
  // scale eye icon to be a portion of container size
  const eyeIconSize = size * EYE_ICON_SCALING_FACTOR

  const uniconImage = <Unicon address={address} size={size} />

  return (
    <Stack
      bg={showBackground ? '$surface1' : '$transparent'}
      borderColor={showBorder ? borderColor : '$transparent'}
      rounded="$full"
      borderWidth={showBorder ? borderWidth : '$none'}
      position="relative"
      mb="$2xs"
      testID="account-icon"
    >
      {avatarUri ? (
        <UniversalImage
          style={{ image: { borderRadius: size } }}
          fallback={uniconImage}
          size={{ width: size, height: size, resizeMode: UniversalImageResizeMode.Cover }}
          uri={avatarUri}
        />
      ) : (
        uniconImage
      )}
      {showViewOnlyBadge && (
        <Stack
          items="center"
          bg="$surface2"
          borderColor="$surface1"
          rounded="$full"
          borderWidth="$3xs"
          b={-4}
          justify="center"
          position="absolute"
          r={-4}
          testID="account-icon/view-only-badge"
        >
          <Eye color="$neutral2" size={eyeIconSize} />
        </Stack>
      )}
    </Stack>
  )
}

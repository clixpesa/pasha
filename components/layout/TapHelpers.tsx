import { Stack, Text } from "@/ui"
import { colorsLight } from '@/ui/theme/colors'
import { tokens } from '@/ui/theme/tokens'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { Route } from 'react-native-tab-view'
export const TAB_VIEW_SCROLL_THROTTLE = 16
export const TAB_BAR_HEIGHT = 48

export const TAB_STYLES = StyleSheet.create({
  activeTabIndicator: {
    backgroundColor: colorsLight.accent1,
    bottom: 0,
    height: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 0,
    paddingBottom: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  headerContainer: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  tabBar: {
    // add inactive border to bottom of tab bar
    borderBottomWidth: 0,
    margin: 0,
    marginHorizontal: 0,
    padding: 0,
    // remove default shadow border under tab bar
    shadowColor: colorsLight.none,
    shadowOpacity: 0,
    shadowRadius: 0,
    top: 0,
  },
  // For padding on the list components themselves within tabs.
  tabListInner: {
    paddingBottom: tokens.space.sm.val,
    paddingTop: tokens.space["2xs"].val,
  },
})

export type TabProps = {
  owner: string
  containerProps?: TabContentProps
  scrollHandler?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  isExternalProfile?: boolean
  renderedInModal?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  isActiveTab?: boolean
  headerHeight?: number
}

export type TabContentProps = {
  contentContainerStyle: StyleProp<ViewStyle>
  emptyComponentStyle?: StyleProp<ViewStyle>
  estimatedItemSize?: number
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onScrollEndDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollEventThrottle?: number
}

export type TabLabelProps = {
  route: Route
  focused: boolean
  isExternalProfile?: boolean
  textStyleType?: 'primary' | 'secondary'
  enableNotificationBadge?: boolean
}

export const TabLabel = ({
  route,
  focused,
  textStyleType = 'primary',
}: TabLabelProps): JSX.Element => {
  return (
    <Stack items="center" gap="$xs">
      <Text
        color={
          focused
            ? textStyleType === 'primary'
              ? '$neutral1'
              : '$neutral2'
            : textStyleType === 'primary'
              ? '$neutral2'
              : '$neutral3'
        }
        variant={textStyleType === 'primary' ? 'body1' : 'subHeading2'}
      >
        {route.title}
      </Text>
    </Stack>
  )
}
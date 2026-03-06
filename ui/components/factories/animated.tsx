import React, { ComponentClass } from 'react'
import Animated, { AnimatedProps } from 'react-native-reanimated'

export function withAnimated<Props extends object>(
  WrappedComponent: React.ComponentType<Props>,
): ComponentClass<AnimatedProps<Props>> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  class WithAnimated extends React.Component<Props> {
    static displayName = `WithAnimated(${displayName})`

    render(): React.ReactNode {
      return <WrappedComponent {...this.props} />
    }
  }

  return Animated.createAnimatedComponent(WithAnimated)
}

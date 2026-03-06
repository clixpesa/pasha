import type { FlexProps } from '@/ui/components/layout'

export type ShineProps = {
  shimmerDurationSeconds?: number
  disabled?: boolean
  children: JSX.Element
} & Omit<FlexProps, 'children'>

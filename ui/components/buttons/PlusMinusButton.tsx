import { Plus as PlusIcon } from '@/ui/components/icons'
import { Flex } from '@/ui/components/layout/Flex'
import { TouchableArea } from '@/ui/components/touchable/TouchableArea/TouchableArea'
import { tokens } from '@/ui/theme/tokens'

export enum PlusMinusButtonType {
  Plus = 0,
  Minus = 1,
}

export function PlusMinusButton({
  type,
  disabled,
  onPress,
}: {
  type: PlusMinusButtonType
  disabled: boolean
  onPress: (type: PlusMinusButtonType) => void
}): JSX.Element {
  return (
    <TouchableArea
      items="center"
      bg={disabled ? '$surface3' : '$neutral2'}
      rounded="$full"
      disabled={disabled}
      height={tokens.icon.sm}
      justify="center"
      width={tokens.icon.sm}
      onPress={(): void => onPress(type)}
    >
      {type === PlusMinusButtonType.Plus ? (
        <PlusIcon color="$surface1" size={16} strokeWidth={2.5} />
      ) : (
        <Flex bg="$surface1" rounded="$md" height={2} width={10} />
      )}
    </TouchableArea>
  )
}

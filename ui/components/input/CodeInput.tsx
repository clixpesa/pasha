import { useThemeColors } from "@/ui/hooks/useThemeColors"
import { forwardRef } from "react"
import { OtpInput, OtpInputProps, OtpInputRef } from "react-native-otp-entry"
import { Stack } from "tamagui"

export type CodeInputRef = OtpInputRef

export const CodeInput = forwardRef<OtpInputRef, OtpInputProps>(
  (props, ref) => {
  const colors = useThemeColors()
  const {numberOfDigits, ...rest} = props
  
  return (

    <Stack px={numberOfDigits === 4 ? "$6xl" : "$4xl"} >
      <OtpInput
        ref={ref}
        focusColor={colors.accent1.val}
        hideStick={true}
        //blurOnFilled={true}
        theme={{
          pinCodeContainerStyle: {
            borderWidth: 2,
            height: 54,
            backgroundColor: colors.surface1.val
          },
          pinCodeTextStyle: {
            color: colors.neutral1.val
          }
        }}
        numberOfDigits={numberOfDigits}
        {...rest}
      />
  </Stack>
  )
})



CodeInput.displayName = "CodeInput"
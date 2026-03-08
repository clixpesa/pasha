import { useThemeColors } from "@/ui/hooks/useThemeColors";
import { PhoneInput as BasePhoneInput, PhoneInputProps } from '@fenadev/react-native-phone-input';
import { Stack } from "tamagui";


export const PhoneInput = ({...rest}: PhoneInputProps) => {
  const colors = useThemeColors()
  return (
    <Stack >
      <BasePhoneInput 
        defaultCountryCode="KE"
        isCallingCodeEditable={false}
        theme={{
          containerStyle: {
            minWidth: 320,
            borderWidth: 2,
            borderRadius: 20 
          },
          textInputStyle: {
            fontSize: 22,
            color: colors.neutral1.val
          }
        }}
       
        {...rest}
      />
  </Stack>
  )
}
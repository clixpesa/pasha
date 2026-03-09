import { Text, TouchableArea, XStack, YStack } from "@/ui";
import { CheckCircle } from "@/ui/components/icons";
import { useEffect, useRef, useState } from "react";


interface ResendTimerProps {
	initialSeconds?: number;
	isSourcePhone?: boolean;
	onResend: () => Promise<void>;
}

export const ResendTimer = ({
	initialSeconds = 30,
	isSourcePhone,
	onResend,
}: ResendTimerProps) => {
	const [seconds, setSeconds] = useState(initialSeconds);
	const [isActive, setIsActive] = useState(true);
	const timerRef = useRef<NodeJS.Timeout>();

	const handleResend = async () => {
		try {
			await onResend();
			setSeconds(initialSeconds);
			setIsActive(true);
		} catch (error) {
			console.error("Failed to resend OTP:", error);
		}
	};

	useEffect(() => {
		if (!isActive) return;

		timerRef.current = setInterval(() => {
			setSeconds((prev) => {
				if (prev <= 1) {
					setIsActive(false);
					clearInterval(timerRef.current);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timerRef.current);
	}, [isActive]);

	return (
		<YStack items="center" justify="center" gap="$vs">
			<Text>
				Did not receive a code? {isSourcePhone ? null : "Check spam or"}
			</Text>
			<TouchableArea
				items="center"
				hitSlop={16}
				mb="$sm"
				onPress={handleResend}
			>
				{isActive ? (
					<YStack items="center" gap="$sm">
						<Text variant="body2">
							Resend code in {seconds} {seconds !== 1 ? "seconds" : "second"}
						</Text>
						<XStack items="center" gap="$vs">
							<CheckCircle size={20} color="$statusSuccess" />
							<Text color="$statusSuccess" fontSize="$lg">
								Code sent!
							</Text>
						</XStack>
					</YStack>
				) : (
					<Text
						//$short={{ variant: "buttonLabel1", fontSize: "$medium" }}
						color="$accent1"
						variant="buttonLabel1"
					>
						{"Re-send code"}
					</Text>
				)}
			</TouchableArea>
		</YStack>
	);
};

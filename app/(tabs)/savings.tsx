import { H1, Text, YStack } from "tamagui";

export default function Savings() {
  return (
    <YStack
      flex={1}
      backgroundColor="$primaryBg"
      padding="$6"
      justifyContent="center"
      alignItems="center"
      gap="$4"
    >
      <H1 color="$primaryDeepGreen">Savings</H1>
      <Text fontSize={14} color="$textSecondary" textAlign="center">
        Track your savings goals here.
      </Text>
    </YStack>
  );
}

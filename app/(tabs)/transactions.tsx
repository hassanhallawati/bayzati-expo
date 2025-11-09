import { H1, Text, YStack } from "tamagui";

export default function Transactions() {
  return (
    <YStack
      flex={1}
      backgroundColor="$primaryBg"
      padding="$6"
      justifyContent="center"
      alignItems="center"
      gap="$4"
    >
      <H1 color="$primaryDeepGreen">Transactions</H1>
      <Text fontSize={14} color="$textSecondary" textAlign="center">
        Your transactions list will be displayed here.
      </Text>
    </YStack>
  );
}

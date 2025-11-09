import { H1, Text, YStack } from "tamagui";

export default function Insights() {
  return (
    <YStack
      flex={1}
      backgroundColor="$primaryBg"
      padding="$6"
      justifyContent="center"
      alignItems="center"
      gap="$4"
    >
      <H1 color="$primaryDeepGreen">Insights</H1>
      <Text fontSize={14} color="$textSecondary" textAlign="center">
        View your spending insights and analytics here.
      </Text>
    </YStack>
  );
}

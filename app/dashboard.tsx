import { Card, H1, Text, XStack, YStack } from "tamagui";

export default function Index() {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      backgroundColor="$background"
    >
      <H1 color="$primaryDeepGreen">Expense Tracker</H1>
      <Text color="$textSecondary" marginTop="$2" marginBottom="$6">
        Dashboard Placeholder page
      </Text>

      {/* Color Preview Cards */}
      <YStack gap="$3" width="100%" maxWidth={400}>
        <Card backgroundColor="$primaryCard" padding="$4" borderWidth={1} borderColor="$border">
          <Text color="$textPrimary" fontWeight="600" marginBottom="$2">
            Brand Colors
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            <YStack flex={1} minWidth={80} alignItems="center" gap="$1">
              <YStack width={50} height={50} backgroundColor="$primaryDeepGreen" borderRadius="$2" />
              <Text fontSize={10} color="$textSecondary">Deep Green</Text>
            </YStack>
            <YStack flex={1} minWidth={80} alignItems="center" gap="$1">
              <YStack width={50} height={50} backgroundColor="$primaryGreen" borderRadius="$2" />
              <Text fontSize={10} color="$textSecondary">Primary</Text>
            </YStack>
          </XStack>
        </Card>

        <Card backgroundColor="$primaryCard" padding="$4" borderWidth={1} borderColor="$border">
          <Text color="$textPrimary" fontWeight="600" marginBottom="$2">
            Semantic Colors
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            <YStack flex={1} minWidth={80} alignItems="center" gap="$1">
              <YStack width={50} height={50} backgroundColor="$expense" borderRadius="$2" />
              <Text fontSize={10} color="$textSecondary">Expense</Text>
            </YStack>
            <YStack flex={1} minWidth={80} alignItems="center" gap="$1">
              <YStack width={50} height={50} backgroundColor="$income" borderRadius="$2" />
              <Text fontSize={10} color="$textSecondary">Income</Text>
            </YStack>
            <YStack flex={1} minWidth={80} alignItems="center" gap="$1">
              <YStack width={50} height={50} backgroundColor="$warning" borderRadius="$2" />
              <Text fontSize={10} color="$textSecondary">Warning</Text>
            </YStack>
            <YStack flex={1} minWidth={80} alignItems="center" gap="$1">
              <YStack width={50} height={50} backgroundColor="$info" borderRadius="$2" />
              <Text fontSize={10} color="$textSecondary">Info</Text>
            </YStack>
          </XStack>
        </Card>
      </YStack>
    </YStack>
  );
}

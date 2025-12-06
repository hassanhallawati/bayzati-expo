import { Rocket } from "@tamagui/lucide-icons";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

export default function Insights() {
  const insets = useSafeAreaInsets();

  return (
    <YStack flex={1} backgroundColor="#F4F4F5">
      {/* Header */}
      <YStack backgroundColor="$primaryDeepGreen" paddingTop={insets.top + 16} paddingBottom={16}>
        <XStack alignItems="center" justifyContent="space-between" paddingHorizontal={20}>
          {/* Logo */}
          <Image
            source={require("../../assets/images/b-logo-white.png")}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />

          {/* Title */}
          <Text fontSize={24} fontWeight="600" color="white">
            Insights
          </Text>

          {/* Placeholder for alignment */}
          <YStack width={32} height={32} />
        </XStack>
      </YStack>

      {/* Coming Soon Content */}
      <YStack flex={1} alignItems="center" justifyContent="center" padding={32}>
        <YStack marginBottom={24}>
          <Rocket size={55} color="#1a4742" />
        </YStack>
        <Text
          fontSize={36}
          fontWeight="500"
          color="#1a4742"
          textAlign="center"
          fontFamily="$body"
        >
          Coming Soon
        </Text>
        <Text
          fontSize={16}
          color="#6b7280"
          textAlign="center"
          marginTop={8}
          lineHeight={24}
        >
          We're working hard to bring you this{"\n"}feature. Stay tuned for exciting updates!
        </Text>
      </YStack>
    </YStack>
  );
}

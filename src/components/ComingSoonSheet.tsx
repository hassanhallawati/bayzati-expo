import { Rocket } from "@tamagui/lucide-icons";
import { Sheet, Text, YStack } from "tamagui";

interface ComingSoonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description?: string;
}

const DEFAULT_DESCRIPTION = "We're working hard to bring you this feature. Stay tuned for exciting updates!";

export default function ComingSoonSheet({
  open,
  onOpenChange,
  description = DEFAULT_DESCRIPTION,
}: ComingSoonSheetProps) {
  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[50]}
      dismissOnSnapToBottom
      zIndex={100000}
      animation="medium"
      forceRemoveScrollEnabled={true}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="rgba(0, 0, 0, 0.5)"
      />
      <Sheet.Frame
        backgroundColor="$primaryBg"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        padding={0}
      >
        <Sheet.Handle backgroundColor="#E5E7EB" marginTop={12} />
        <YStack alignItems="center" paddingTop={60} padding={32}>
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
            {description}
          </Text>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

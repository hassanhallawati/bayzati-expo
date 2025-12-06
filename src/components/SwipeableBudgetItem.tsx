import { Trash2 } from "@tamagui/lucide-icons";
import type React from "react";
import { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { YStack } from "tamagui";

interface SwipeableBudgetItemProps {
  itemId: string;
  onDelete: (itemId: string) => void;
  children: React.ReactNode;
}

export default function SwipeableBudgetItem({
  itemId,
  onDelete,
  children,
}: SwipeableBudgetItemProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(itemId);
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    const opacity = dragX.interpolate({
      inputRange: [-80, -40, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.deleteAction,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <YStack
          backgroundColor="#ef4444"
          width={50}
          height="100%"
          alignItems="center"
          justifyContent="center"
          borderRadius={8}
          pressStyle={{ opacity: 0.8 }}
          onPress={handleDelete}
        >
          <Trash2 size={20} color="white" />
        </YStack>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      friction={2}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

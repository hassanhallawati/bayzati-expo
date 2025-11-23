import { ChevronDown, ChevronRight, Pencil } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Circle, Input, Text, XStack, YStack } from "tamagui";

export default function Savings() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"GOALS" | "BUDGET">("BUDGET");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["income", "housing"]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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
            Savings
          </Text>

          {/* Edit Button */}
          <Button
            unstyled
            padding={0}
            backgroundColor="rgba(255, 255, 255, 0.1)"
            width={40}
            height={40}
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.7 }}
          >
            <Pencil size={18} color="white" />
          </Button>
        </XStack>

        {/* Tabs */}
        <XStack justifyContent="center" gap={24} marginTop={16}>
          <Button
            unstyled
            onPress={() => setActiveTab("GOALS")}
            backgroundColor={activeTab === "GOALS" ? "rgba(255, 255, 255, 0.1)" : "transparent"}
            paddingHorizontal={16}
            paddingVertical={6}
            borderRadius={12}
          >
            <Text fontSize={14} fontWeight="600" color="white">
              GOALS
            </Text>
          </Button>

          <Button
            unstyled
            onPress={() => setActiveTab("BUDGET")}
            backgroundColor={activeTab === "BUDGET" ? "rgba(255, 255, 255, 0.1)" : "transparent"}
            paddingHorizontal={16}
            paddingVertical={6}
            borderRadius={12}
          >
            <Text fontSize={14} fontWeight="600" color="white">
              BUDGET
            </Text>
          </Button>
        </XStack>
      </YStack>

      <ScrollView>
        {/* Monthly Income Card */}
        <YStack
          backgroundColor="#176458"
          marginHorizontal={24}
          marginTop={12}
          borderRadius={8}
          padding={16}
        >
          <XStack justifyContent="space-between" alignItems="center" marginBottom={6}>
            <Text fontSize={14} fontWeight="700" color="#F4F4F5">
              Monthly Income
            </Text>
            <Text fontSize={14} fontWeight="700" color="#F4F4F5">
              OMR 8,000
            </Text>
          </XStack>

          {/* Progress Bar */}
          <YStack height={14} borderRadius={8} overflow="hidden" marginBottom={6}>
            <XStack height={14}>
              <YStack width="53%" backgroundColor="#C1E3D5" height={14} />
              <YStack flex={1} backgroundColor="#EAEAEA" height={14} />
            </XStack>
          </YStack>

          <XStack justifyContent="space-between">
            <Text fontSize={10} fontWeight="500" color="#F4F4F5">
              OMR 4,250 Budgeted
            </Text>
            <Text fontSize={10} fontWeight="500" color="#F4F4F5">
              OMR 3,750 Left
            </Text>
          </XStack>
        </YStack>

        {/* Income Category */}
        <YStack
          backgroundColor="white"
          marginHorizontal={24}
          marginTop={12}
          borderRadius={16}
          padding={12}
        >
          {/* Category Header */}
          <XStack
            alignItems="center"
            justifyContent="space-between"
            onPress={() => toggleCategory("income")}
            pressStyle={{ opacity: 0.7 }}
          >
            <XStack alignItems="center" gap={12} flex={1}>
              <Circle size={43} backgroundColor="#C3EDDF">
                <Text fontSize={20}>💰</Text>
              </Circle>
              <Text fontSize={14} fontWeight="500" color="#333333">
                Income
              </Text>
            </XStack>

            <XStack alignItems="center" gap={8}>
              <Text fontSize={14} fontWeight="600" color="#333333">
                OMR 150
              </Text>
              <Button unstyled padding={0} onPress={() => toggleCategory("income")}>
                <ChevronDown
                  size={24}
                  color="#7a7a7a"
                  style={{
                    transform: [{ rotate: expandedCategories.includes("income") ? "180deg" : "0deg" }],
                  }}
                />
              </Button>
            </XStack>
          </XStack>

          {/* Subcategories */}
          {expandedCategories.includes("income") && (
            <YStack marginTop={12} gap={8} paddingLeft={55}>
              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap={8}>
                  <Text fontSize={20}>💼</Text>
                  <Text fontSize={12} color="#333333">
                    Salary
                  </Text>
                </XStack>
                <Input
                  backgroundColor="#EAEAEA"
                  borderRadius={9999}
                  paddingHorizontal={12}
                  paddingVertical={4}
                  width={60}
                  height={23}
                  fontSize={12}
                  fontWeight="500"
                  color="black"
                  textAlign="center"
                  borderWidth={0}
                  defaultValue="1,500"
                />
              </XStack>

              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap={8}>
                  <Text fontSize={20}>💻</Text>
                  <Text fontSize={12} color="#333333">
                    Freelance
                  </Text>
                </XStack>
                <Input
                  backgroundColor="#EAEAEA"
                  borderRadius={9999}
                  paddingHorizontal={12}
                  paddingVertical={4}
                  width={60}
                  height={23}
                  fontSize={12}
                  fontWeight="500"
                  color="black"
                  textAlign="center"
                  borderWidth={0}
                  defaultValue="1,500"
                />
              </XStack>

              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap={8}>
                  <Text fontSize={20}>📈</Text>
                  <Text fontSize={12} color="#333333">
                    Investments
                  </Text>
                </XStack>
                <Input
                  backgroundColor="#EAEAEA"
                  borderRadius={9999}
                  paddingHorizontal={12}
                  paddingVertical={4}
                  width={60}
                  height={23}
                  fontSize={12}
                  fontWeight="500"
                  color="black"
                  textAlign="center"
                  borderWidth={0}
                  defaultValue="1,500"
                />
              </XStack>
            </YStack>
          )}
        </YStack>

        {/* Housing Category */}
        <YStack
          backgroundColor="white"
          marginHorizontal={24}
          marginTop={12}
          borderRadius={16}
          padding={12}
        >
          {/* Category Header */}
          <XStack
            alignItems="center"
            justifyContent="space-between"
            onPress={() => toggleCategory("housing")}
            pressStyle={{ opacity: 0.7 }}
          >
            <XStack alignItems="center" gap={12} flex={1}>
              <Circle size={43} backgroundColor="#FDF2C4">
                <Text fontSize={20}>🏠</Text>
              </Circle>
              <Text fontSize={14} fontWeight="500" color="#333333">
                Housing
              </Text>
            </XStack>

            <XStack alignItems="center" gap={8}>
              <Text fontSize={14} fontWeight="600" color="#333333">
                OMR 150
              </Text>
              <Button unstyled padding={0} onPress={() => toggleCategory("housing")}>
                <ChevronDown
                  size={24}
                  color="#7a7a7a"
                  style={{
                    transform: [{ rotate: expandedCategories.includes("housing") ? "180deg" : "0deg" }],
                  }}
                />
              </Button>
            </XStack>
          </XStack>

          {/* Subcategories */}
          {expandedCategories.includes("housing") && (
            <YStack marginTop={12} gap={8} paddingLeft={55}>
              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap={8}>
                  <Text fontSize={20}>🔑</Text>
                  <Text fontSize={12} color="#333333">
                    Rent / Mortgage
                  </Text>
                </XStack>
                <Input
                  backgroundColor="#EAEAEA"
                  borderRadius={9999}
                  paddingHorizontal={12}
                  paddingVertical={4}
                  width={60}
                  height={23}
                  fontSize={12}
                  fontWeight="500"
                  color="black"
                  textAlign="center"
                  borderWidth={0}
                  defaultValue="1,500"
                />
              </XStack>

              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap={8}>
                  <Text fontSize={20}>💡</Text>
                  <Text fontSize={12} color="#333333">
                    Utilities
                  </Text>
                </XStack>
                <Input
                  backgroundColor="#EAEAEA"
                  borderRadius={9999}
                  paddingHorizontal={12}
                  paddingVertical={4}
                  width={60}
                  height={23}
                  fontSize={12}
                  fontWeight="500"
                  color="black"
                  textAlign="center"
                  borderWidth={0}
                  defaultValue="1,500"
                />
              </XStack>

              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap={8}>
                  <Text fontSize={20}>📺</Text>
                  <Text fontSize={12} color="#333333">
                    Internet & TV
                  </Text>
                </XStack>
                <Input
                  backgroundColor="#EAEAEA"
                  borderRadius={9999}
                  paddingHorizontal={12}
                  paddingVertical={4}
                  width={60}
                  height={23}
                  fontSize={12}
                  fontWeight="500"
                  color="black"
                  textAlign="center"
                  borderWidth={0}
                  defaultValue="1,500"
                />
              </XStack>

              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap={8}>
                  <Text fontSize={20}>📱</Text>
                  <Text fontSize={12} color="#333333">
                    Phone
                  </Text>
                </XStack>
                <Input
                  backgroundColor="#EAEAEA"
                  borderRadius={9999}
                  paddingHorizontal={12}
                  paddingVertical={4}
                  width={60}
                  height={23}
                  fontSize={12}
                  fontWeight="500"
                  color="black"
                  textAlign="center"
                  borderWidth={0}
                  defaultValue="1,500"
                />
              </XStack>
            </YStack>
          )}
        </YStack>

        {/* Food & Beverage Category */}
        <YStack
          backgroundColor="white"
          marginHorizontal={24}
          marginTop={12}
          borderRadius={16}
          padding={12}
        >
          <XStack
            alignItems="center"
            justifyContent="space-between"
            onPress={() => toggleCategory("food")}
            pressStyle={{ opacity: 0.7 }}
          >
            <XStack alignItems="center" gap={12} flex={1}>
              <Circle size={43} backgroundColor="#FCE6C2">
                <Text fontSize={20}>🍽️</Text>
              </Circle>
              <Text fontSize={14} fontWeight="500" color="#333333">
                Food & Beverage
              </Text>
            </XStack>

            <XStack alignItems="center" gap={8}>
              <Text fontSize={14} fontWeight="600" color="#333333">
                OMR 150
              </Text>
              <Button unstyled padding={0} onPress={() => toggleCategory("food")}>
                <ChevronRight size={24} color="#7a7a7a" />
              </Button>
            </XStack>
          </XStack>
        </YStack>

        {/* Entertainment Category */}
        <YStack
          backgroundColor="white"
          marginHorizontal={24}
          marginTop={12}
          marginBottom={24}
          borderRadius={16}
          padding={12}
        >
          <XStack
            alignItems="center"
            justifyContent="space-between"
            onPress={() => toggleCategory("entertainment")}
            pressStyle={{ opacity: 0.7 }}
          >
            <XStack alignItems="center" gap={12} flex={1}>
              <Circle size={43} backgroundColor="#EFE0FE">
                <Text fontSize={20}>🎮</Text>
              </Circle>
              <Text fontSize={14} fontWeight="500" color="#333333">
                Entertainment
              </Text>
            </XStack>

            <XStack alignItems="center" gap={8}>
              <Text fontSize={14} fontWeight="600" color="#333333">
                OMR 150
              </Text>
              <Button unstyled padding={0} onPress={() => toggleCategory("entertainment")}>
                <ChevronRight size={24} color="#7a7a7a" />
              </Button>
            </XStack>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

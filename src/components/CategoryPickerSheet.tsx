import { ChevronDown, ChevronUp, Search, X } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { Image, Platform, ScrollView } from "react-native";
import { Button, Circle, Input, Sheet, Text, XStack, YStack } from "tamagui";
import { fetchCategoriesByType } from "../services/categoryService";
import type { Category, Subcategory } from "../types/category";

// Get the appropriate base URL for media files based on platform
const getMediaBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  return 'https://dev.bayzati.com'; // For iOS and web
};

interface CategoryPickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCategory: (categoryName: string, subcategoryName: string, subcategory: Subcategory) => void;
  transactionType?: "INCOME" | "EXPENSE";
}

export default function CategoryPickerSheet({
  open,
  onOpenChange,
  onSelectCategory,
  transactionType = "EXPENSE",
}: CategoryPickerSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Fetch categories when sheet opens
  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open, transactionType]);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategoriesByType(transactionType);
      setCategories(data);
      // Expand all categories by default
      setExpandedCategories(new Set(data.map((cat) => cat.id)));
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleSelectSubcategory = (
    category: Category,
    subcategory: Subcategory
  ) => {
    onSelectCategory(category.name, subcategory.name, subcategory);
    onOpenChange(false);
  };

  const filteredCategories = categories
    .map((category: Category) => ({
      ...category,
      subcategories: category.subcategories.filter((sub: Subcategory) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(
      (category: Category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.subcategories.length > 0
    );

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[85]}
      dismissOnSnapToBottom
      zIndex={100001}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="rgba(0, 0, 0, 0.5)"
      />
      <Sheet.Handle backgroundColor="$borderColor" />
      <Sheet.Frame
        backgroundColor="$primaryBg"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        padding={0}
      >
        <YStack flex={1}>
          {/* Header */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal={20}
            paddingVertical={16}
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <Button
              size="$3"
              chromeless
              circular
              icon={<X size={24} color="$textPrimary" />}
              onPress={() => onOpenChange(false)}
            />
            <Text fontSize={20} fontWeight="600" color="$primaryGreen">
              Categories
            </Text>
            <YStack width={40} />
          </XStack>

          {/* Search Bar */}
          <YStack padding={16}>
            <XStack
              backgroundColor="white"
              padding={12}
              borderRadius={12}
              alignItems="center"
              gap={12}
              borderWidth={1}
              borderColor="$borderColor"
            >
              <Search size={20} color="$textSecondary" />
              <Input
                flex={1}
                placeholder="Search Categories"
                value={searchQuery}
                onChangeText={setSearchQuery}
                borderWidth={0}
                backgroundColor="transparent"
                fontSize={16}
                color="$textPrimary"
                placeholderTextColor="$textSecondary"
              />
            </XStack>
          </YStack>

          {/* Categories List */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <YStack padding={40} alignItems="center">
                <Text fontSize={16} color="$textSecondary">
                  Loading categories...
                </Text>
              </YStack>
            ) : filteredCategories.length === 0 ? (
              <YStack padding={40} alignItems="center">
                <Text fontSize={16} color="$textSecondary">
                  No categories found
                </Text>
              </YStack>
            ) : (
              <YStack paddingHorizontal={16} gap={24}>
                {filteredCategories.map((category: Category) => (
                  <YStack key={category.id} gap={12}>
                    {/* Category Header */}
                    <XStack
                      alignItems="center"
                      justifyContent="space-between"
                      onPress={() => toggleCategory(category.id)}
                      pressStyle={{ opacity: 0.7 }}
                      cursor="pointer"
                    >
                      <XStack alignItems="center" gap={8}>
                        {category.icon && (
                          <Circle size={22} overflow="hidden">
                            <Image
                              source={{ uri: `${getMediaBaseURL()}${category.icon}` }}
                              style={{ width: 22, height: 22 }}
                              resizeMode="cover"
                            />
                          </Circle>
                        )}
                        <Text fontSize={18} fontWeight="500" color="$textPrimary">
                          {category.name}
                        </Text>
                      </XStack>
                      <Button
                        size="$2"
                        chromeless
                        circular
                        icon={
                          expandedCategories.has(category.id) ? (
                            <ChevronUp size={20} color="$textSecondary" />
                          ) : (
                            <ChevronDown size={20} color="$textSecondary" />
                          )
                        }
                        onPress={() => toggleCategory(category.id)}
                      />
                    </XStack>

                    {/* Separator */}
                    <YStack
                      height={1}
                      backgroundColor="$borderColor"
                      marginBottom={4}
                    />

                    {/* Subcategories Grid */}
                    {expandedCategories.has(category.id) && (
                      <XStack flexWrap="wrap" gap={16}>
                        {category.subcategories.map((subcategory: Subcategory) => (
                          <YStack
                            key={subcategory.id}
                            width={75}
                            alignItems="center"
                            gap={8}
                            onPress={() => handleSelectSubcategory(category, subcategory)}
                            pressStyle={{ opacity: 0.7 }}
                            cursor="pointer"
                          >
                            <YStack
                              width={56}
                              height={56}
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Image
                                source={{ uri: `${getMediaBaseURL()}${subcategory.icon_round}` }}
                                style={{ width: 56, height: 56 }}
                                resizeMode="contain"
                              />
                            </YStack>
                            <Text
                              fontSize={12}
                              color="$textSecondary"
                              textAlign="center"
                              numberOfLines={2}
                            >
                              {subcategory.name}
                            </Text>
                          </YStack>
                        ))}
                      </XStack>
                    )}
                  </YStack>
                ))}
              </YStack>
            )}
          </ScrollView>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

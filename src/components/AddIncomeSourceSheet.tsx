import { X } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input, Sheet, Text, XStack, YStack } from "tamagui";
import { createBudgetedItem, fetchAvailableIncomeSubcategories } from "../services/budgetService";
import type { Category, Subcategory } from "../types/category";
import { getMediaBaseURL } from "../utils/media";

interface AddIncomeSourceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetId?: string;
  onIncomeAdded?: () => void;
}

export default function AddIncomeSourceSheet({
  open,
  onOpenChange,
  budgetId,
  onIncomeAdded,
}: AddIncomeSourceSheetProps) {
  const [amount, setAmount] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    amount?: string;
    category?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch available income subcategories when sheet opens
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAvailableIncomeSubcategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch income subcategories:", error);
      setApiError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setSelectedSubcategory(null);
    setErrors({});
    setApiError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const handleSave = async () => {
    setErrors({});
    setApiError(null);

    const newErrors: typeof errors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!selectedSubcategory) {
      newErrors.category = "Please select a category";
    }

    if (!budgetId) {
      setApiError("No active budget found. Please try again.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      await createBudgetedItem({
        budget_id: budgetId,
        type: "INCOME",
        subcategory_id: selectedSubcategory!.id,
        amount: parseFloat(amount).toFixed(3),
      });

      resetForm();
      onOpenChange(false);

      if (onIncomeAdded) {
        onIncomeAdded();
      }
    } catch (error: any) {
      console.error("Failed to add income source:", error);

      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors: typeof errors = {};

        if (apiErrors.amount) {
          newErrors.amount = Array.isArray(apiErrors.amount)
            ? apiErrors.amount[0]
            : apiErrors.amount;
        }
        if (apiErrors.subcategory_id) {
          newErrors.category = Array.isArray(apiErrors.subcategory_id)
            ? apiErrors.subcategory_id[0]
            : apiErrors.subcategory_id;
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
        } else {
          const message =
            apiErrors.detail ||
            apiErrors.non_field_errors?.[0] ||
            "Failed to add income source. Please try again.";
          setApiError(message);
        }
      } else {
        setApiError("Failed to add income source. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Flatten all subcategories from all categories into a single list
  const allSubcategories = categories.flatMap((cat) => cat.subcategories);

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[75]}
      dismissOnSnapToBottom
      zIndex={100000}
      animation="medium"
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
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === "ios"}
          extraHeight={130}
          extraScrollHeight={130}
        >
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
              onPress={handleClose}
            />
            <Text fontSize={18} fontWeight="600" color="$textPrimary">
              Add Income
            </Text>
            <Button
              size="$3"
              chromeless
              onPress={handleSave}
              disabled={isSaving}
              opacity={isSaving ? 0.5 : 1}
            >
              <Text fontSize={16} fontWeight="600" color="$primaryDeepGreen">
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </Button>
          </XStack>

          <YStack padding={24}>
            {/* Amount Section */}
            <YStack alignItems="center" marginBottom={32}>
              <Text fontSize={16} color="$textSecondary" marginBottom={8}>
                Enter Amount
              </Text>
              <XStack alignItems="center" gap={0}>
                <Text fontSize={30} fontWeight="700" color="$textPrimary">
                  OMR
                </Text>
                <Input
                  fontSize={30}
                  fontWeight="700"
                  color="$textPrimary"
                  placeholder="0.00"
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  keyboardType="decimal-pad"
                  borderWidth={0}
                  backgroundColor="transparent"
                  textAlign="center"
                  width="auto"
                  minWidth={100}
                  paddingLeft={0}
                  paddingRight={0}
                  marginLeft={-5}
                  placeholderTextColor="$textSecondary"
                />
              </XStack>
              {errors.amount && (
                <Text fontSize={14} color="red" marginTop={8} textAlign="center">
                  {errors.amount}
                </Text>
              )}
            </YStack>

            {/* Category Section */}
            <YStack>
              <Text fontSize={14} fontWeight="500" color="#343a40" marginBottom={16}>
                Select Category
              </Text>

              {isLoading ? (
                <YStack alignItems="center" padding={24}>
                  <ActivityIndicator size="small" color="#0a5f4c" />
                </YStack>
              ) : allSubcategories.length === 0 ? (
                <YStack alignItems="center" padding={24}>
                  <Text fontSize={14} color="$textSecondary" textAlign="center">
                    No income categories available
                  </Text>
                </YStack>
              ) : (
                <XStack flexWrap="wrap" gap={12}>
                  {allSubcategories.map((subcategory) => {
                    const isSelected = selectedSubcategory?.id === subcategory.id;
                    return (
                      <YStack
                        key={subcategory.id}
                        width={80}
                        alignItems="center"
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => handleSubcategorySelect(subcategory)}
                      >
                        <Image
                          source={{ uri: `${getMediaBaseURL()}${subcategory.icon_round}` }}
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            borderWidth: isSelected ? 2 : 0,
                            borderColor: isSelected ? "#0a5f4c" : "transparent",
                          }}
                          resizeMode="cover"
                        />
                        <Text
                          fontSize={12}
                          color={isSelected ? "#0a5f4c" : "#343a40"}
                          fontWeight={isSelected ? "600" : "400"}
                          textAlign="center"
                          marginTop={4}
                          numberOfLines={2}
                        >
                          {subcategory.name}
                        </Text>
                      </YStack>
                    );
                  })}
                </XStack>
              )}

              {errors.category && (
                <Text fontSize={12} color="red" marginTop={8}>
                  {errors.category}
                </Text>
              )}
            </YStack>

            {/* API Error Display */}
            {apiError && (
              <Text fontSize={14} color="red" textAlign="center" marginTop={16}>
                {apiError}
              </Text>
            )}
          </YStack>
        </KeyboardAwareScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}

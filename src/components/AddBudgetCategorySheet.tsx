import { ChevronRight, Tag, X } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Image, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input, Sheet, Text, XStack, YStack } from "tamagui";
import { createBudgetedItem, fetchAvailableExpenseSubcategories } from "../services/budgetService";
import type { Subcategory } from "../types/category";
import { getMediaBaseURL } from "../utils/media";
import CategoryPickerSheet from "./CategoryPickerSheet";

interface AddBudgetCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetId?: string;
  onCategoryAdded?: (categoryId?: string) => void;
}

export default function AddBudgetCategorySheet({
  open,
  onOpenChange,
  budgetId,
  onCategoryAdded,
}: AddBudgetCategorySheetProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [errors, setErrors] = useState<{
    amount?: string;
    category?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setSelectedSubcategory(null);
    setSelectedCategoryName("");
    setErrors({});
    setApiError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleCategorySelect = (
    categoryName: string,
    subcategoryName: string,
    subcategory: Subcategory
  ) => {
    setCategory(subcategoryName);
    setSelectedSubcategory(subcategory);
    setSelectedCategoryName(categoryName);
    // Clear category error when selected
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const handleSave = async () => {
    // Clear previous errors
    setErrors({});
    setApiError(null);

    // Validate fields
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
      const response = await createBudgetedItem({
        budget_id: budgetId,
        type: "EXPENSE",
        subcategory_id: selectedSubcategory!.id,
        amount: parseFloat(amount).toFixed(3),
      });

      // Success: reset form, close sheet, trigger refresh
      resetForm();
      onOpenChange(false);

      if (onCategoryAdded) {
        onCategoryAdded(response.subcategory.category_id);
      }
    } catch (error: any) {
      console.error("Failed to add budget category:", error);

      // Handle API errors
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors: typeof errors = {};

        // Map specific field errors
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
          // Generic API error (non-field specific)
          const message =
            apiErrors.detail ||
            apiErrors.non_field_errors?.[0] ||
            "Failed to add category. Please try again.";
          setApiError(message);
        }
      } else {
        setApiError("Failed to add category. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[70]}
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
              Budget Expense
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

            {/* Category Selector */}
            <YStack>
              <XStack
                backgroundColor="#FAFAFA"
                padding={16}
                borderRadius={12}
                alignItems="center"
                gap={12}
                pressStyle={{ opacity: 0.7 }}
                cursor="pointer"
                onPress={() => setShowCategoryPicker(true)}
              >
                {selectedSubcategory ? (
                  <YStack
                    width={40}
                    height={40}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image
                      source={{
                        uri: `${getMediaBaseURL()}${selectedSubcategory.icon_round}`,
                      }}
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                    />
                  </YStack>
                ) : (
                  <Tag size={24} color="$primaryDeepGreen" />
                )}
                <YStack flex={1}>
                  {category ? (
                    <>
                      <Text fontSize={16} color="$textPrimary" fontWeight="500">
                        {category}
                      </Text>
                      {selectedCategoryName && (
                        <Text fontSize={12} color="$textSecondary" marginTop={2}>
                          {selectedCategoryName}
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text fontSize={16} color="$textPrimary">
                      Select Category
                    </Text>
                  )}
                </YStack>
                <ChevronRight size={24} color="$textSecondary" />
              </XStack>
              {errors.category && (
                <Text fontSize={12} color="red" marginTop={4} marginLeft={12}>
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

      {/* Category Picker Sheet */}
      <CategoryPickerSheet
        open={showCategoryPicker}
        onOpenChange={setShowCategoryPicker}
        onSelectCategory={handleCategorySelect}
        customFetchCategories={fetchAvailableExpenseSubcategories}
      />
    </Sheet>
  );
}

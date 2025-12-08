import { Calendar, ChevronLeft, ChevronRight, FileText, Tag, X } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input, Sheet, Text, XStack, YStack } from "tamagui";
import { searchMerchants } from "../services/merchantService";
import { createTransaction, formatDateForAPI, updateTransaction } from "../services/transactionService";
import type { Subcategory } from "../types/category";
import type { Merchant } from "../types/merchant";
import type { Transaction } from "../types/transaction";
import { getMediaBaseURL } from "../utils/media";
import CalendarPickerSheet from "./CalendarPickerSheet";
import CategoryPickerSheet from "./CategoryPickerSheet";

interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onTransactionCreated?: () => void;
  onTransactionUpdated?: () => void;
}

export default function AddTransactionSheet({ open, onOpenChange, transaction, onTransactionCreated, onTransactionUpdated }: AddTransactionSheetProps) {
  const isEditMode = !!transaction;
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [merchantSuggestions, setMerchantSuggestions] = useState<Merchant[]>([]);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [isVendorSelected, setIsVendorSelected] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [isLoadingMerchants, setIsLoadingMerchants] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [errors, setErrors] = useState<{
    amount?: string;
    vendor?: string;
    category?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form values when in edit mode
  useEffect(() => {
    if (transaction && open) {
      setTransactionType(transaction.type);
      setAmount(transaction.amount);
      setVendor(transaction.merchant || "");
      setCategory(transaction.subcategory);
      setSelectedCategoryName(transaction.category);
      setNote(transaction.notes || "");

      // Parse date from ISO 8601 format (e.g., "2025-11-14T00:00:00+04:00" or "2025-11-13T20:00:00Z")
      // Extract just the date portion and create a local date to avoid timezone issues
      const dateStr = transaction.transaction_date_time.split('T')[0];
      const [year, month, day] = dateStr.split('-').map(Number);
      const parsedDate = new Date(year, month - 1, day);
      setDate(parsedDate);

      // Set subcategory for display with icon
      setSelectedSubcategory({
        id: "", // We don't have this from the transaction object
        name: transaction.subcategory,
        icon_round: transaction.category_icon_round,
      });

      // Mark as vendor selected if it's an expense
      if (transaction.type === "EXPENSE" && transaction.merchant) {
        setIsVendorSelected(true);
        // Create a mock merchant object for proper state management
        setSelectedMerchant({
          id: transaction.id,
          merchant_name: transaction.merchant,
          category: {
            id: "",
            name: transaction.category,
            icon: transaction.category_icon,
          },
          subcategory: {
            id: "",
            name: transaction.subcategory,
            icon_round: transaction.category_icon_round,
          },
          is_approved: true,
        });
      }
    } else if (!transaction && open) {
      // Reset to default for add mode
      resetForm();
      setTransactionType("EXPENSE");
    }
  }, [transaction, open]);

  // Fetch merchants from API based on input
  useEffect(() => {
    if (vendor.trim().length > 0 && !isVendorSelected) {
      const fetchMerchants = async () => {
        setIsLoadingMerchants(true);
        try {
          const merchants = await searchMerchants(vendor.trim());
          setMerchantSuggestions(merchants);
          if (merchants.length > 0) {
            setShowVendorDropdown(true);
          } else {
            setShowVendorDropdown(false);
          }
        } catch (error) {
          console.error("Failed to fetch merchants:", error);
          setMerchantSuggestions([]);
          setShowVendorDropdown(false);
        } finally {
          setIsLoadingMerchants(false);
        }
      };

      // Debounce API calls to avoid too many requests
      const timeoutId = setTimeout(fetchMerchants, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setMerchantSuggestions([]);
      setShowVendorDropdown(false);
    }
  }, [vendor, isVendorSelected]);

  const handleVendorSelect = (merchant: Merchant) => {
    setIsVendorSelected(true);
    setShowVendorDropdown(false);
    setVendor(merchant.merchant_name);
    setSelectedMerchant(merchant);
    // Convert merchant subcategory to full subcategory format
    setSelectedSubcategory({
      id: merchant.subcategory.id,
      name: merchant.subcategory.name,
      icon_round: merchant.subcategory.icon_round,
    });
    // Auto-fill category from merchant data (use subcategory name)
    setCategory(merchant.subcategory.name);
    setSelectedCategoryName(merchant.category.name);
  };

  const handleVendorChange = (text: string) => {
    setIsVendorSelected(false);
    setVendor(text);
    setSelectedMerchant(null);
    setSelectedSubcategory(null);
    setSelectedCategoryName("");
    // Clear auto-filled category when user manually edits vendor
    setCategory("");
  };

  const resetForm = () => {
    setAmount("");
    setVendor("");
    setCategory("");
    setDate(new Date());
    setNote("");
    setSelectedMerchant(null);
    setSelectedSubcategory(null);
    setSelectedCategoryName("");
    setIsVendorSelected(false);
    setShowVendorDropdown(false);
    setMerchantSuggestions([]);
  };

  const handleClose = () => {
    resetForm();
    setTransactionType("EXPENSE");
    onOpenChange(false);
  };

  const handleTransactionTypeChange = (type: "INCOME" | "EXPENSE") => {
    setTransactionType(type);
    // Only clear vendor and category when toggling transaction type
    // Keep amount, date, and note
    setVendor("");
    setCategory("");
    setSelectedMerchant(null);
    setSelectedSubcategory(null);
    setSelectedCategoryName("");
    setIsVendorSelected(false);
    setShowVendorDropdown(false);
    setMerchantSuggestions([]);
  };

  const handleCategorySelect = (categoryName: string, subcategoryName: string, subcategory: Subcategory) => {
    setCategory(subcategoryName); // Use subcategory name instead of category name
    setSelectedSubcategory(subcategory);
    setSelectedCategoryName(categoryName);
  };

  const handleDateIncrement = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const handleDateDecrement = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time for comparison
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return "Today";
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      // Format as "Monday, 14 Jan"
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: '2-digit',
        month: 'short'
      };
      return date.toLocaleDateString('en-US', options);
    }
  };

  const handleCalendarDateSelect = (newDate: Date) => {
    setDate(newDate);
  };

  const handleSave = async () => {
    // Clear previous errors
    setErrors({});

    // Validate fields
    const newErrors: typeof errors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (transactionType === "EXPENSE" && !vendor.trim()) {
      newErrors.vendor = "Please enter a merchant name";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const transactionData = transactionType === "EXPENSE"
        ? {
            transaction_type: "EXPENSE" as const,
            merchant_name: vendor.trim(),
            subcategory: category,
            transaction_amount: amount,
            transaction_date_time: formatDateForAPI(date),
            notes: note.trim() || undefined,
          }
        : {
            transaction_type: "INCOME" as const,
            subcategory: category,
            transaction_amount: amount,
            transaction_date_time: formatDateForAPI(date),
            notes: note.trim() || undefined,
          };

      if (isEditMode) {
        // Edit mode - update existing transaction
        if (!transaction?.id) {
          throw new Error("Transaction ID is required for update");
        }

        await updateTransaction(transaction.id, transactionData);

        // Success - reset form and close modal
        resetForm();
        onOpenChange(false);

        // Notify parent to refresh transaction list
        if (onTransactionUpdated) {
          onTransactionUpdated();
        }
      } else {
        // Add mode - create new transaction
        await createTransaction(transactionData);

        // Success - reset form and close modal
        resetForm();
        onOpenChange(false);

        // Notify parent to refresh transaction list
        if (onTransactionCreated) {
          onTransactionCreated();
        }
      }
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} transaction:`, error);

      // Handle API errors
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors: typeof errors = {};

        if (apiErrors.transaction_amount) {
          newErrors.amount = apiErrors.transaction_amount[0];
        }
        if (apiErrors.merchant_name) {
          newErrors.vendor = apiErrors.merchant_name[0];
        }
        if (apiErrors.subcategory) {
          newErrors.category = apiErrors.subcategory[0];
        }

        setErrors(newErrors);
      } else {
        // Generic error
        setErrors({
          amount: "Failed to create transaction. Please try again.",
        });
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
      snapPoints={[90]}
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
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={100}
          enableResetScrollToCoords={false}
        >
            <YStack padding={20}>
              {/* Header */}
              <XStack justifyContent="space-between" alignItems="center" marginBottom={24}>
          <Button
            size="$3"
            chromeless
            circular
            icon={<X size={24} color="$textPrimary" />}
            onPress={handleClose}
          />
          <Text fontSize={18} fontWeight="600" color="$textPrimary">
            {isEditMode ? "Edit Transaction" : "Add Transaction"}
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

        {/* Amount Section */}
        <YStack alignItems="center" marginBottom={32}>
          <Text fontSize={14} color="$textSecondary" marginBottom={8}>
            Enter Amount
          </Text>
          <XStack alignItems="center" gap={0}>
            <Text fontSize={48} fontWeight="700" color="$textPrimary">
              OMR
            </Text>
            <Input
              fontSize={48}
              fontWeight="700"
              color="$textPrimary"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              borderWidth={0}
              backgroundColor="transparent"
              textAlign="center"
              width="auto"
              minWidth={150}
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

        {/* Income/Expense Toggle - Segmented Control */}
        <XStack
          backgroundColor="$borderColor"
          borderRadius={100}
          padding={4}
          marginBottom={32}
        >
          <Button
            flex={1}
            size="$4"
            backgroundColor={transactionType === "EXPENSE" ? "$primaryDeepGreen" : "transparent"}
            borderRadius={100}
            borderWidth={0}
            pressStyle={{
              backgroundColor: transactionType === "EXPENSE" ? "$primaryDeepGreen" : "transparent",
              opacity: 0.9,
            }}
            onPress={() => handleTransactionTypeChange("EXPENSE")}
          >
            <Text
              fontSize={16}
              fontWeight="600"
              color={transactionType === "EXPENSE" ? "white" : "$textSecondary"}
            >
              Expense
            </Text>
          </Button>
          <Button
            flex={1}
            size="$4"
            backgroundColor={transactionType === "INCOME" ? "$primaryDeepGreen" : "transparent"}
            borderRadius={100}
            borderWidth={0}
            pressStyle={{
              backgroundColor: transactionType === "INCOME" ? "$primaryDeepGreen" : "transparent",
              opacity: 0.9,
            }}
            onPress={() => handleTransactionTypeChange("INCOME")}
          >
            <Text
              fontSize={16}
              fontWeight="600"
              color={transactionType === "INCOME" ? "white" : "$textSecondary"}
            >
              Income
            </Text>
          </Button>
        </XStack>

        {/* Form Fields */}
        <YStack gap={16}>
          {/* Add Vendor - Only show for EXPENSE */}
          {transactionType === "EXPENSE" && (
            <YStack position="relative">
              <XStack
                backgroundColor="white"
                padding={16}
                borderRadius={12}
                alignItems="center"
                gap={12}
              >
                <Tag size={24} color="$primaryDeepGreen" />
                <Input
                  flex={1}
                  placeholder="Select or Add Merchant"
                  value={vendor}
                  onChangeText={handleVendorChange}
                  borderWidth={0}
                  backgroundColor="transparent"
                  fontSize={16}
                  color="$textPrimary"
                  placeholderTextColor="$textSecondary"
                />
              </XStack>
              {errors.vendor && (
                <Text fontSize={12} color="red" marginTop={4} marginLeft={12}>
                  {errors.vendor}
                </Text>
              )}

              {/* Vendor Suggestions Dropdown */}
              {showVendorDropdown && merchantSuggestions.length > 0 && (
                <YStack
                  backgroundColor="white"
                  borderRadius={12}
                  marginTop={8}
                  elevation={4}
                  shadowColor="$shadowColor"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.1}
                  shadowRadius={4}
                  maxHeight={200}
                  overflow="hidden"
                >
                  <ScrollView>
                    {isLoadingMerchants ? (
                      <YStack padding={16} alignItems="center">
                        <Text fontSize={14} color="$textSecondary">
                          Loading...
                        </Text>
                      </YStack>
                    ) : (
                      merchantSuggestions.map((merchant, index) => (
                        <TouchableOpacity
                          key={merchant.id}
                          onPress={() => handleVendorSelect(merchant)}
                        >
                          <YStack
                            padding={12}
                            paddingHorizontal={16}
                            borderBottomWidth={index < merchantSuggestions.length - 1 ? 1 : 0}
                            borderBottomColor="$borderColor"
                          >
                            <Text fontSize={16} color="$textPrimary" fontWeight="600">
                              {merchant.merchant_name}
                            </Text>
                            <Text fontSize={12} color="$textSecondary" marginTop={2}>
                              {merchant.category.name} • {merchant.subcategory.name}
                            </Text>
                          </YStack>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </YStack>
              )}
            </YStack>
          )}

          {/* Select Category */}
          <YStack>
            <XStack
              backgroundColor="white"
              padding={16}
              borderRadius={12}
              alignItems="center"
              gap={12}
              pressStyle={!selectedMerchant ? { opacity: 0.7 } : undefined}
              cursor={!selectedMerchant ? "pointer" : "default"}
              opacity={selectedMerchant ? 0.5 : 1}
              onPress={() => {
                if (!selectedMerchant) {
                  setShowCategoryPicker(true);
                }
              }}
            >
              {selectedSubcategory ? (
                <YStack
                  width={44}
                  height={44}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    source={{ uri: `${getMediaBaseURL()}${selectedSubcategory.icon_round}` }}
                    style={{ width: 44, height: 44 }}
                    resizeMode="contain"
                  />
                </YStack>
              ) : (
                <Tag size={24} color="$primaryDeepGreen" />
              )}
              <YStack flex={1}>
                {category ? (
                  <>
                    <Text fontSize={16} color="$textPrimary" fontWeight="600">
                      {category}
                    </Text>
                    {selectedCategoryName && (
                      <Text fontSize={12} color="$textSecondary" marginTop={2}>
                        {selectedCategoryName}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text fontSize={16} color="$textSecondary">
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

          {/* Date */}
          <XStack
            backgroundColor="white"
            padding={16}
            borderRadius={12}
            alignItems="center"
            gap={12}
          >
            <XStack
              flex={1}
              alignItems="center"
              gap={12}
              onPress={() => setShowCalendarPicker(true)}
              pressStyle={{ opacity: 0.7 }}
              cursor="pointer"
            >
              <Calendar size={24} color="$textPrimary" />
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color="$textPrimary">
                  Date
                </Text>
                <Text fontSize={14} color="$textSecondary">
                  {formatDate(date)}
                </Text>
              </YStack>
            </XStack>
            <XStack gap={8} alignItems="center">
              <Button
                size="$3"
                chromeless
                circular
                icon={<ChevronLeft size={20} color="$textSecondary" />}
                onPress={handleDateDecrement}
                pressStyle={{ opacity: 0.7 }}
              />
              <Button
                size="$3"
                chromeless
                circular
                icon={<ChevronRight size={20} color="$textSecondary" />}
                onPress={handleDateIncrement}
                pressStyle={{ opacity: 0.7 }}
              />
            </XStack>
          </XStack>

          {/* Add a note */}
          <XStack
            backgroundColor="white"
            padding={16}
            borderRadius={12}
            alignItems="center"
            gap={12}
          >
            <FileText size={24} color="$primaryDeepGreen" />
            <Input
              flex={1}
              placeholder="Add a note"
              value={note}
              onChangeText={setNote}
              borderWidth={0}
              backgroundColor="transparent"
              fontSize={16}
              color="$textPrimary"
              placeholderTextColor="$textSecondary"
            />
          </XStack>
        </YStack>
            </YStack>
        </KeyboardAwareScrollView>
      </Sheet.Frame>

      {/* Category Picker Sheet */}
      <CategoryPickerSheet
        open={showCategoryPicker}
        onOpenChange={setShowCategoryPicker}
        onSelectCategory={handleCategorySelect}
        transactionType={transactionType}
      />

      {/* Calendar Picker Sheet */}
      <CalendarPickerSheet
        open={showCalendarPicker}
        onOpenChange={setShowCalendarPicker}
        selectedDate={date}
        onSelectDate={handleCalendarDateSelect}
      />
    </Sheet>
  );
}

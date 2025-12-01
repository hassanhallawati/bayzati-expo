import { ChevronDown, Pencil } from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, RefreshControl } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Circle, Input, Text, XStack, YStack } from "tamagui";
import AddBudgetCategorySheet from "../../src/components/AddBudgetCategorySheet";
import { getBudgetSummary, updateBudgetedItemAmount } from "../../src/services/budgetService";
import type { BudgetSummaryResponse } from "../../src/types/budget";

const getMediaBaseURL = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }
  return "https://dev.bayzati.com";
};

export default function Savings() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"GOALS" | "BUDGET">("BUDGET");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for inline editing
  const [editingAmounts, setEditingAmounts] = useState<Record<string, string>>({});
  const [savingItems, setSavingItems] = useState<Set<string>>(new Set());
  const [errorItems, setErrorItems] = useState<Record<string, string>>({});
  const saveTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // State for Add Category sheet
  const [showAddCategorySheet, setShowAddCategorySheet] = useState(false);

  const fetchBudgetData = async (isRefresh = false, silent = false) => {
    if (!silent) {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
    }
    setError(null);
    try {
      const data = await getBudgetSummary();
      setBudgetData(data);
      // Initialize expanded categories - expand income and first expense category
      if (!isRefresh) {
        const initialExpanded: string[] = ["income"];
        if (data.expense_breakdown.length > 0) {
          initialExpanded.push(data.expense_breakdown[0].category_id);
        }
        setExpandedCategories(initialExpanded);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch budget data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const onRefresh = () => {
    fetchBudgetData(true);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Calculate progress percentage for the summary bar
  const calculateProgress = () => {
    if (!budgetData) return 0;
    const income = parseFloat(budgetData.total_budgeted_income) || 0;
    const expenses = parseFloat(budgetData.total_budgeted_expenses) || 0;
    if (income === 0) return 0;
    return Math.min((expenses / income) * 100, 100);
  };

  // Calculate total income from income_breakdown
  const getTotalIncome = () => {
    if (!budgetData || budgetData.income_breakdown.length === 0) return 0;
    return budgetData.income_breakdown.reduce((sum, item) => sum + item.budgeted_amount, 0);
  };

  // Get display value for input: edited value or original
  const getDisplayValue = (itemId: string, originalAmount: number) => {
    return editingAmounts[itemId] ?? originalAmount.toString();
  };

  // Save amount to API
  const saveAmount = async (itemId: string, value: string, originalAmount: number) => {
    // Validate: must be a valid number
    const numericValue = parseFloat(value.replace(/,/g, ""));
    if (isNaN(numericValue) || numericValue < 0) {
      // Revert to original
      setEditingAmounts((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      return;
    }

    setSavingItems((prev) => new Set(prev).add(itemId));

    try {
      await updateBudgetedItemAmount(itemId, numericValue.toString());
      // Clear edited state for this item
      setEditingAmounts((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      // Refresh to get updated totals (silent - no spinner)
      fetchBudgetData(true, true);
    } catch (err: any) {
      // Revert to original on error
      setEditingAmounts((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      // Set error message for this item
      const errorMessage =
        err.response?.data?.amount?.[0] ||
        err.response?.data?.detail ||
        "Failed to save";
      setErrorItems((prev) => ({ ...prev, [itemId]: errorMessage }));
    } finally {
      setSavingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  // Debounced save function
  const debouncedSave = (itemId: string, value: string, originalAmount: number) => {
    // Clear existing timeout for this item
    if (saveTimeouts.current[itemId]) {
      clearTimeout(saveTimeouts.current[itemId]);
    }

    // Set new timeout
    saveTimeouts.current[itemId] = setTimeout(async () => {
      await saveAmount(itemId, value, originalAmount);
    }, 800);
  };

  // Handle amount change
  const handleAmountChange = (itemId: string, value: string, originalAmount: number) => {
    // Clear any existing error for this item when user starts typing
    setErrorItems((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setEditingAmounts((prev) => ({ ...prev, [itemId]: value }));
    debouncedSave(itemId, value, originalAmount);
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

      {isLoading ? (
        <YStack flex={1} alignItems="center" justifyContent="center" padding={40}>
          <ActivityIndicator size="large" color="#176458" />
          <Text fontSize={14} color="#7a7a7a" marginTop={12}>
            Loading budget...
          </Text>
        </YStack>
      ) : error ? (
        <YStack flex={1} alignItems="center" justifyContent="center" padding={40}>
          <Text fontSize={16} color="#ef4444" textAlign="center">
            {error}
          </Text>
        </YStack>
      ) : !budgetData ? (
        <YStack flex={1} alignItems="center" justifyContent="center" padding={40}>
          <Text fontSize={16} color="#7a7a7a" textAlign="center">
            No budget data available
          </Text>
        </YStack>
      ) : (
        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#176458"
              colors={["#176458"]}
            />
          }
          contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === "ios"}
          //extraHeight={130}
          //extraScrollHeight={130}
        >
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
                OMR {parseFloat(budgetData.total_budgeted_income).toLocaleString()}
              </Text>
            </XStack>

            {/* Progress Bar */}
            <YStack height={14} borderRadius={8} overflow="hidden" marginBottom={6}>
              <XStack height={14}>
                <YStack width={`${calculateProgress()}%`} backgroundColor="#C1E3D5" height={14} />
                <YStack flex={1} backgroundColor="#EAEAEA" height={14} />
              </XStack>
            </YStack>

            <XStack justifyContent="space-between">
              <Text fontSize={10} fontWeight="500" color="#F4F4F5">
                OMR {parseFloat(budgetData.total_budgeted_expenses).toLocaleString()} Budgeted
              </Text>
              <Text fontSize={10} fontWeight="500" color="#F4F4F5">
                OMR {parseFloat(budgetData.remaining_to_budget).toLocaleString()} Left
              </Text>
            </XStack>
          </YStack>

          {/* Income Category */}
          {budgetData.income_breakdown.length > 0 && (
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
                  <Circle size={43} backgroundColor="#FAFAFA">
                    <Image
                      source={{ uri: `${getMediaBaseURL()}${budgetData.income_breakdown[0].category_icon_round}` }}
                      style={{ width: 43, height: 43, borderRadius: 21.5 }}
                      resizeMode="cover"
                    />
                  </Circle>
                  <Text fontSize={14} fontWeight="500" color="#333333">
                    {budgetData.income_breakdown[0].category_name}
                  </Text>
                </XStack>

                <XStack alignItems="center" gap={8}>
                  <Text fontSize={14} fontWeight="600" color="#333333">
                    OMR {getTotalIncome().toLocaleString()}
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
                  {budgetData.income_breakdown.map((item) => (
                    <YStack key={item.id} gap={4}>
                      <XStack alignItems="center" justifyContent="space-between">
                        <XStack alignItems="center" gap={8}>
                          <Image
                            source={{ uri: `${getMediaBaseURL()}${item.subcategory_icon}` }}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                          />
                          <Text fontSize={12} color="#333333">
                            {item.subcategory_name}
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
                          value={getDisplayValue(item.id, item.budgeted_amount)}
                          onChangeText={(text) => handleAmountChange(item.id, text, item.budgeted_amount)}
                          keyboardType="numeric"
                          opacity={savingItems.has(item.id) ? 0.5 : 1}
                        />
                      </XStack>
                      {errorItems[item.id] && (
                        <Text fontSize={10} color="#ef4444" textAlign="right">
                          {errorItems[item.id]}
                        </Text>
                      )}
                    </YStack>
                  ))}
                </YStack>
              )}
            </YStack>
          )}

          {/* Expense Categories */}
          {budgetData.expense_breakdown.map((category, index) => {
            const isExpanded = expandedCategories.includes(category.category_id);
            const isLast = index === budgetData.expense_breakdown.length - 1;

            return (
              <YStack
                key={category.category_id}
                backgroundColor="white"
                marginHorizontal={24}
                marginTop={12}
                marginBottom={isLast ? 24 : 0}
                borderRadius={16}
                padding={12}
              >
                {/* Category Header */}
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  onPress={() => toggleCategory(category.category_id)}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <XStack alignItems="center" gap={12} flex={1}>
                    <Circle size={43} backgroundColor="#FAFAFA">
                      <Image
                        source={{ uri: `${getMediaBaseURL()}${category.category_icon_round}` }}
                        style={{ width: 43, height: 43, borderRadius: 21.5 }}
                        resizeMode="cover"
                      />
                    </Circle>
                    <Text fontSize={14} fontWeight="500" color="#333333">
                      {category.category_name}
                    </Text>
                  </XStack>

                  <XStack alignItems="center" gap={8}>
                    <Text fontSize={14} fontWeight="600" color="#333333">
                      OMR {category.total_budgeted.toLocaleString()}
                    </Text>
                    <Button unstyled padding={0} onPress={() => toggleCategory(category.category_id)}>
                      <ChevronDown
                        size={24}
                        color="#7a7a7a"
                        style={{
                          transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                        }}
                      />
                    </Button>
                  </XStack>
                </XStack>

                {/* Subcategories */}
                {isExpanded && category.subcategories.length > 0 && (
                  <YStack marginTop={12} gap={8} paddingLeft={55}>
                    {category.subcategories.map((subcategory) => (
                      <YStack key={subcategory.id} gap={4}>
                        <XStack alignItems="center" justifyContent="space-between">
                          <XStack alignItems="center" gap={8}>
                            <Image
                              source={{ uri: `${getMediaBaseURL()}${subcategory.subcategory_icon}` }}
                              style={{ width: 20, height: 20 }}
                              resizeMode="contain"
                            />
                            <Text fontSize={12} color="#333333">
                              {subcategory.subcategory_name}
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
                            value={getDisplayValue(subcategory.id, subcategory.budgeted_amount)}
                            onChangeText={(text) => handleAmountChange(subcategory.id, text, subcategory.budgeted_amount)}
                            keyboardType="numeric"
                            opacity={savingItems.has(subcategory.id) ? 0.5 : 1}
                          />
                        </XStack>
                        {errorItems[subcategory.id] && (
                          <Text fontSize={10} color="#ef4444" textAlign="right">
                            {errorItems[subcategory.id]}
                          </Text>
                        )}
                      </YStack>
                    ))}
                  </YStack>
                )}
              </YStack>
            );
          })}
        </KeyboardAwareScrollView>
      )}

      {/* Budget Expense Button */}
      <Button
        position="absolute"
        bottom={insets.bottom}
        left={24}
        right={24}
        height={50}
        backgroundColor="$primaryDeepGreen"
        borderRadius={12}
        pressStyle={{ opacity: 0.9 }}
        onPress={() => setShowAddCategorySheet(true)}
      >
        <Text fontSize={16} fontWeight="600" color="white">
          + Budget Expense
        </Text>
      </Button>

      {/* Add Budget Category Sheet */}
      <AddBudgetCategorySheet
        open={showAddCategorySheet}
        onOpenChange={setShowAddCategorySheet}
        budgetId={budgetData?.budget_id}
        onCategoryAdded={(categoryId) => {
          // Expand only the category that was just added to
          if (categoryId) {
            setExpandedCategories([categoryId]);
          }
          // Refresh budget data silently
          fetchBudgetData(true, true);
        }}
      />
    </YStack>
  );
}

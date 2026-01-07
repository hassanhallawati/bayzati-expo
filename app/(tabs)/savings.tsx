import { ChevronDown, Pencil, Plus, Rocket } from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, RefreshControl } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Circle, Input, Text, XStack, YStack } from "tamagui";
import AddBudgetCategorySheet from "../../src/components/AddBudgetCategorySheet";
import AddIncomeSourceSheet from "../../src/components/AddIncomeSourceSheet";
import ComingSoonSheet from "../../src/components/ComingSoonSheet";
import SwipeableBudgetItem from "../../src/components/SwipeableBudgetItem";
import { getUserProfile } from "../../src/services/authService";
import { createBudget, deleteBudgetedItem, getBudgetSummary, updateBudgetedItemAmount } from "../../src/services/budgetService";
import type { BudgetSummaryResponse } from "../../src/types/budget";
import { getMediaBaseURL } from "../../src/utils/media";

export default function Savings() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"GOALS" | "BUDGET">("BUDGET");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noBudgetFound, setNoBudgetFound] = useState(false);
  const [isCreatingBudget, setIsCreatingBudget] = useState(false);

  // State for inline editing
  const [editingAmounts, setEditingAmounts] = useState<Record<string, string>>({});
  const [savingItems, setSavingItems] = useState<Set<string>>(new Set());
  const [errorItems, setErrorItems] = useState<Record<string, string>>({});
  const saveTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // State for Add Category sheet
  const [showAddCategorySheet, setShowAddCategorySheet] = useState(false);
  const [showAddIncomeSheet, setShowAddIncomeSheet] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const fetchBudgetData = async (isRefresh = false, silent = false) => {
    if (!silent) {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
    }
    setError(null);
    setNoBudgetFound(false);
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
      // Check for 404 "No active budget found" error
      if (err.response?.status === 404 && err.response?.data?.detail?.includes("No active budget found")) {
        setNoBudgetFound(true);
      } else {
        setError(err.message || "Failed to fetch budget data");
      }
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

  // Handle delete budget item
  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteBudgetedItem(itemId);
      // Refresh budget data - this automatically handles:
      // - Removing the item from the list
      // - Removing empty categories (server returns updated data)
      fetchBudgetData(true, true);
    } catch (error) {
      console.error("Failed to delete budget item:", error);
    }
  };

  // Handle create budget
  const handleCreateBudget = async () => {
    setIsCreatingBudget(true);
    try {
      // Get user profile for budget name
      const userProfile = await getUserProfile();
      const displayName = `${userProfile.first_name} ${userProfile.last_name}`.trim() || userProfile.email.split("@")[0];

      await createBudget({
        name: `${displayName} - monthly budget`,
        is_active: true,
        items: [
          { type: "INCOME", subcategory_id: "dd380dc6-4222-454a-a7ee-6731d3fb5b99", amount: "0.000" },
          { type: "EXPENSE", subcategory_id: "0007978e-aab2-45f1-bca0-bb3edaa96206", amount: "0.000" },
          { type: "EXPENSE", subcategory_id: "befe605c-4b95-4430-be14-40e475361b85", amount: "0.000" },
          { type: "EXPENSE", subcategory_id: "d82c561d-285a-43e8-8bb6-cd859c67112b", amount: "0.000" },
          { type: "EXPENSE", subcategory_id: "df1f0a44-329c-4eaa-ab4d-0f8e911531ed", amount: "0.000" },
          { type: "EXPENSE", subcategory_id: "164ed897-0f49-498d-a1b5-eb9a341c88b0", amount: "0.000" },
          { type: "EXPENSE", subcategory_id: "02f97b8c-4956-4416-86c7-45979ef12dd9", amount: "0.000" },
        ],
      });

      // Refresh to show the new budget
      fetchBudgetData(false, false);
    } catch (error) {
      console.error("Failed to create budget:", error);
    } finally {
      setIsCreatingBudget(false);
    }
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
            onPress={() => setShowComingSoon(true)}
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

      {/* Goals Tab - Coming Soon */}
      {activeTab === "GOALS" && (
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
      )}

      {/* Budget Tab Content */}
      {activeTab === "BUDGET" && isLoading ? (
        <YStack flex={1} alignItems="center" justifyContent="center" padding={40}>
          <ActivityIndicator size="large" color="#176458" />
          <Text fontSize={14} color="#7a7a7a" marginTop={12}>
            Loading budget...
          </Text>
        </YStack>
      ) : activeTab === "BUDGET" && error ? (
        <YStack flex={1} alignItems="center" justifyContent="center" padding={40}>
          <Text fontSize={16} color="#ef4444" textAlign="center">
            {error}
          </Text>
        </YStack>
      ) : activeTab === "BUDGET" && noBudgetFound ? (
        /* No Budget Set Placeholder */
        <YStack flex={1} alignItems="baseline" justifyContent="flex-start" padding={20}>
          <YStack
            backgroundColor="white"
            borderRadius={16}
            padding={20}
            alignItems="center"
            gap={16}
            width="100%"
          >
            <Circle size={74} backgroundColor="#E5E7EB">
              <Text fontSize={40} color="#9CA3AF">$</Text>
            </Circle>
            <Text fontSize={18} fontWeight="700" color="#333333" textAlign="center">
              No Budget Set
            </Text>
            <Text fontSize={12} color="#6B7280" textAlign="center" lineHeight={18}>
              Create a budget to track your spending and reach your goals.
            </Text>
            <Button
              backgroundColor="#164a41"
              borderRadius={12}
              height={25}
              paddingHorizontal={32}
              pressStyle={{ opacity: 0.9 }}
              onPress={handleCreateBudget}
              disabled={isCreatingBudget}
              opacity={isCreatingBudget ? 0.7 : 1}
            >
              {isCreatingBudget ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text fontSize={12} fontWeight="600" color="white">
                  + Create Budget
                </Text>
              )}
            </Button>
          </YStack>
        </YStack>
      ) : activeTab === "BUDGET" && !budgetData ? (
        <YStack flex={1} alignItems="center" justifyContent="center" padding={40}>
          <Text fontSize={16} color="#7a7a7a" textAlign="center">
            No budget data available
          </Text>
        </YStack>
      ) : activeTab === "BUDGET" && budgetData ? (
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

          {/* Income Category - Always visible */}
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
                    source={{
                      uri: budgetData.income_breakdown.length > 0
                        ? `${getMediaBaseURL()}${budgetData.income_breakdown[0].category_icon_round}`
                        : `${getMediaBaseURL()}/media/category_icon_round/Income_Circle.png`
                    }}
                    style={{ width: 43, height: 43, borderRadius: 21.5 }}
                    resizeMode="cover"
                  />
                </Circle>
                <Text fontSize={14} fontWeight="500" color="#333333">
                  {budgetData.income_breakdown.length > 0
                    ? budgetData.income_breakdown[0].category_name
                    : "Income"}
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

            {/* Subcategories - Only show when there are items */}
            {expandedCategories.includes("income") && budgetData.income_breakdown.length > 0 && (
              <YStack marginTop={12} gap={8} paddingLeft={55}>
                {budgetData.income_breakdown.map((item) => (
                  <SwipeableBudgetItem
                    key={item.id}
                    itemId={item.id}
                    onDelete={handleDeleteItem}
                  >
                    <YStack gap={4}>
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
                  </SwipeableBudgetItem>
                ))}
              </YStack>
            )}

            {/* Add Income Source - Visible when expanded */}
            {expandedCategories.includes("income") && (
              <XStack
                alignItems="center"
                gap={8}
                marginTop={budgetData.income_breakdown.length > 0 ? 8 : 12}
                paddingLeft={55}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => setShowAddIncomeSheet(true)}
              >
                <Circle size={24} backgroundColor="#EAEAEA">
                  <Plus size={14} color="#333333" />
                </Circle>
                <Text fontSize={12} color="#333333">
                  Add income Source
                </Text>
              </XStack>
            )}
          </YStack>

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
                      <SwipeableBudgetItem
                        key={subcategory.id}
                        itemId={subcategory.id}
                        onDelete={handleDeleteItem}
                      >
                        <YStack gap={4}>
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
                      </SwipeableBudgetItem>
                    ))}
                  </YStack>
                )}
              </YStack>
            );
          })}
        </KeyboardAwareScrollView>
      ) : null}

      {/* Floating Action Button - Only show on Budget tab when budget exists */}
      {activeTab === "BUDGET" && !noBudgetFound && budgetData && (
        <Circle
          size={64}
          backgroundColor="$primaryDeepGreen"
          position="absolute"
          bottom={20}
          alignSelf="center"
          elevation={8}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={8}
          pressStyle={{
            scale: 0.95,
            opacity: 0.9,
          }}
          cursor="pointer"
          onPress={() => setShowAddCategorySheet(true)}
        >
          <Plus size={32} color="white" />
        </Circle>
      )}

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

      {/* Add Income Source Sheet */}
      <AddIncomeSourceSheet
        open={showAddIncomeSheet}
        onOpenChange={setShowAddIncomeSheet}
        budgetId={budgetData?.budget_id}
        onIncomeAdded={() => {
          // Expand only the income category
          setExpandedCategories(["income"]);
          // Refresh budget data silently
          fetchBudgetData(true, true);
        }}
      />

      {/* Coming Soon Sheet */}
      <ComingSoonSheet
        open={showComingSoon}
        onOpenChange={setShowComingSoon}
        description={"You'll be able to add and manage multiple budgets soon! stay tuned.."}
      />
    </YStack>
  );
}

import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Circle, Text, XStack, YStack } from "tamagui";
import { getDashboardData } from "../../src/services/dashboardService";
import { formatPeriodForAPI } from "../../src/services/transactionService";
import type { DashboardDataResponse } from "../../src/types/dashboard";

// Get the appropriate base URL for media files based on platform
const getMediaBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  return 'https://dev.bayzati.com'; // For iOS and web
};

export default function Overview() {
  const insets = useSafeAreaInsets();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedType, setSelectedType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [dashboardData, setDashboardData] = useState<DashboardDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Fetch dashboard data when month or type changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const period = formatPeriodForAPI(selectedMonth);
        const data = await getDashboardData(period, selectedType);
        setDashboardData(data);
        // Set initially expanded categories based on API response
        const initiallyExpanded = data.categories
          .filter(cat => cat.expanded === "true")
          .map(cat => cat.id);
        setExpandedCategories(initiallyExpanded);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedMonth, selectedType]);

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <YStack flex={1} backgroundColor="#F4F4F5" position="relative">
      {/* Header */}
      <YStack
        backgroundColor="$primaryDeepGreen"
        paddingTop={insets.top + 16}
        paddingBottom={16}
        paddingHorizontal={20}
      >
        <XStack alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Image
            source={require("../../assets/images/b-logo-white.png")}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />

          {/* Month Navigation */}
          <XStack
            alignItems="center"
            gap={12}
            backgroundColor="rgba(255, 255, 255, 0.15)"
            paddingHorizontal={16}
            paddingVertical={8}
            borderRadius={20}
          >
            <Button
              unstyled
              onPress={handlePreviousMonth}
              padding={0}
              pressStyle={{ opacity: 0.7 }}
            >
              <ChevronLeft size={20} color="white" />
            </Button>

            <Text
              fontSize={16}
              fontWeight="500"
              color="white"
              minWidth={120}
              textAlign="center"
            >
              {formatMonth(selectedMonth)}
            </Text>

            <Button
              unstyled
              onPress={handleNextMonth}
              padding={0}
              pressStyle={{ opacity: 0.7 }}
            >
              <ChevronRight size={20} color="white" />
            </Button>
          </XStack>

          {/* Filter Icon */}
          <Button
            unstyled
            padding={0}
            pressStyle={{ opacity: 0.7 }}
          >
            <SlidersHorizontal size={24} color="white" />
          </Button>
        </XStack>

        {/* Summary Cards */}
        <XStack gap={15} justifyContent="space-between" marginTop={24}>
          {/* Budget Card */}
          <YStack
            backgroundColor="rgba(255, 255, 255, 0.1)"
            borderRadius={16}
            padding={12}
            flex={1}
            alignItems="center"
          >
            <Text fontSize={16} fontWeight="600" color="white" textAlign="center">
              {dashboardData?.summary.total_budgeted || "0"} OMR
            </Text>
            <Text fontSize={10} fontWeight="600" color="white" marginTop={4}>
              BUDGET
            </Text>
          </YStack>

          {/* Spending Card */}
          <YStack
            backgroundColor="rgba(255, 255, 255, 0.1)"
            borderRadius={16}
            padding={12}
            flex={1}
            alignItems="center"
          >
            <Text fontSize={16} fontWeight="600" color="white" textAlign="center">
              {dashboardData?.summary.total_spending || "0"} OMR
            </Text>
            <Text fontSize={10} fontWeight="600" color="white" marginTop={4}>
              SPENDING
            </Text>
          </YStack>

          {/* Balance Card */}
          <YStack
            backgroundColor="rgba(255, 255, 255, 0.2)"
            borderRadius={16}
            padding={12}
            flex={1}
            alignItems="center"
          >
            <Text fontSize={16} fontWeight="600" color="white" textAlign="center">
              {dashboardData?.summary.balance || "0"} OMR
            </Text>
            <Text fontSize={10} fontWeight="600" color="white" marginTop={4}>
              BALANCE
            </Text>
          </YStack>
        </XStack>
      </YStack>

      {/* Spending/Income Toggle */}
      <YStack paddingHorizontal={20} paddingTop={16} paddingBottom={8}>
        <XStack
          backgroundColor="#FAFAFA"
          borderRadius={100}
          padding={4}
        >
          <Button
            flex={1}
            size="$4"
            backgroundColor={selectedType === "EXPENSE" ? "$primaryDeepGreen" : "transparent"}
            borderRadius={100}
            borderWidth={0}
            pressStyle={{
              backgroundColor: selectedType === "EXPENSE" ? "$primaryDeepGreen" : "transparent",
              opacity: 0.9,
            }}
            onPress={() => setSelectedType("EXPENSE")}
          >
            <Text
              fontSize={16}
              fontWeight="600"
              color={selectedType === "EXPENSE" ? "white" : "#7a7a7a"}
            >
              Expense
            </Text>
          </Button>
          <Button
            flex={1}
            size="$4"
            backgroundColor={selectedType === "INCOME" ? "$primaryDeepGreen" : "transparent"}
            borderRadius={100}
            borderWidth={0}
            pressStyle={{
              backgroundColor: selectedType === "INCOME" ? "$primaryDeepGreen" : "transparent",
              opacity: 0.9,
            }}
            onPress={() => setSelectedType("INCOME")}
          >
            <Text
              fontSize={16}
              fontWeight="600"
              color={selectedType === "INCOME" ? "white" : "#7a7a7a"}
            >
              Income
            </Text>
          </Button>
        </XStack>
      </YStack>

      {/* Main Content */}
      <ScrollView>
        {isLoading ? (
          <YStack padding={40} alignItems="center" justifyContent="center">
            <ActivityIndicator size="large" color="$primaryDeepGreen" />
            <Text fontSize={14} color="#7a7a7a" marginTop={12}>
              Loading dashboard...
            </Text>
          </YStack>
        ) : error ? (
          <YStack padding={40} alignItems="center" justifyContent="center">
            <Text fontSize={16} color="#ef4444" textAlign="center">
              {error}
            </Text>
          </YStack>
        ) : !dashboardData || dashboardData.categories.length === 0 ? (
          /* No Transactions Message */
          <YStack padding={40} alignItems="center" justifyContent="center">
            <Text fontSize={16} color="#7a7a7a" textAlign="center">
              No transactions this month
            </Text>
          </YStack>
        ) : (
          /* Category Cards */
          <YStack padding={20} gap={16}>
            {dashboardData.categories.map((category) => {
              const isExpanded = expandedCategories.includes(category.id);

              return (
                <YStack key={category.id} backgroundColor="white" borderRadius={16} padding={12}>
                  {/* Category Header */}
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center" gap={12} flex={1}>
                      {/* Category Icon */}
                      <Circle size={45}>
                        <Image
                          source={{ uri: `${getMediaBaseURL()}${category.category_icon_round}` }}
                          style={{ width: 45, height: 45 }}
                          resizeMode="contain"
                        />
                      </Circle>

                      {/* Category Info */}
                      <YStack flex={1}>
                        <Text fontSize={14} fontWeight="500" color="#333333">
                          {category.category}
                        </Text>
                      </YStack>
                    </XStack>

                    {/* Amount and Toggle */}
                    <XStack alignItems="center" gap={8}>
                      <Text fontSize={16} fontWeight="600" color="#333333">
                        OMR {category.total_spent.toFixed(2)}{category.budgeted_amount > 0 ? ` / ${category.budgeted_amount.toFixed(2)}` : ""}
                      </Text>
                      <Button
                        unstyled
                        padding={0}
                        onPress={() => toggleCategory(category.id)}
                        pressStyle={{ opacity: 0.7 }}
                      >
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

                  {/* Subcategories (Expanded) */}
                  {isExpanded && category.expenses.length > 0 && (
                    <YStack marginTop={12} gap={8} paddingLeft={55} paddingRight={20}>
                      {category.expenses.map((expense, index) => (
                        <XStack
                          key={index}
                          alignItems="center"
                          justifyContent="space-between"
                          paddingVertical={4}
                        >
                          <XStack alignItems="center" gap={8} flex={1}>
                            <XStack 
                            width={2}
                            alignSelf="stretch"
                            backgroundColor="$borderColor"
                            mx={8}
                            /> 
                            <Image
                              source={{ uri: `${getMediaBaseURL()}${expense.subcategory_icon}` }}
                              style={{ width: 22, height: 22 }}
                              resizeMode="contain"
                            />
                            <Text fontSize={12} color="#333333">
                              {expense.subcategory}
                            </Text>
                          </XStack>
                          <Text fontSize={14} color="#7a7a7a" textAlign="right">
                            OMR {expense.amount}{parseFloat(expense.budgeted_amount) > 0 ? ` / ${expense.budgeted_amount}` : ""}
                          </Text>
                        </XStack>
                      ))}
                    </YStack>
                  )}
                </YStack>
              );
            })}
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
}

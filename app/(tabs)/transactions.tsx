import { useState } from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text, Circle, Button } from "tamagui";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock transaction data
const mockTransactions = [
  {
    id: "1",
    date: "2025-05-09",
    dateLabel: "Today",
    merchant: "Starbucks",
    category: "Food & Beverage",
    amount: -7.45,
    icon: "☕",
    iconBg: "#FCE8C2",
  },
  {
    id: "2",
    date: "2025-05-09",
    merchant: "Starbucks",
    category: "Food & Beverage",
    amount: -7.45,
    icon: "☕",
    iconBg: "#FCE8C2",
  },
  {
    id: "3",
    date: "2025-05-09",
    merchant: "Starbucks",
    category: "Food & Beverage",
    amount: -7.45,
    icon: "☕",
    iconBg: "#FCE8C2",
  },
  {
    id: "4",
    date: "2025-05-08",
    dateLabel: "Yesterday",
    merchant: "Starbucks",
    category: "Food & Beverage",
    amount: -7.45,
    icon: "☕",
    iconBg: "#FCE8C2",
  },
  {
    id: "5",
    date: "2025-05-08",
    merchant: "Starbucks",
    category: "Food & Beverage",
    amount: -7.45,
    icon: "☕",
    iconBg: "#FCE8C2",
  },
  {
    id: "6",
    date: "2025-05-08",
    merchant: "Starbucks",
    category: "Food & Beverage",
    amount: -7.45,
    icon: "☕",
    iconBg: "#FCE8C2",
  },
  {
    id: "7",
    date: "2025-06-01",
    dateLabel: "Sunday, 01 Jun",
    merchant: "Starbucks",
    category: "Food & Beverage",
    amount: 7.45,
    icon: "☕",
    iconBg: "#C3EDDF",
  },
];

export default function Transactions() {
  const insets = useSafeAreaInsets();
  const [selectedMonth, setSelectedMonth] = useState(new Date(2025, 4)); // May 2025

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

  // Group transactions by date
  const groupedTransactions = mockTransactions.reduce((groups, transaction) => {
    const dateLabel = transaction.dateLabel || transaction.date;
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(transaction);
    return groups;
  }, {} as Record<string, typeof mockTransactions>);

  // Calculate total for each group
  const getGroupTotal = (transactions: typeof mockTransactions) => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <YStack flex={1} backgroundColor="$primaryBg">
      {/* Header */}
      <YStack
        backgroundColor="$primaryDeepGreen"
        paddingTop={insets.top + 16}
        paddingBottom={16}
        paddingHorizontal={20}
      >
        <XStack alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Text
            fontSize={32}
            fontWeight="700"
            color="white"
            fontFamily="Inter"
          >
            b
          </Text>

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
      </YStack>

      {/* Transaction List */}
      <ScrollView>
        <YStack padding={20} gap={24}>
          {Object.entries(groupedTransactions).map(([dateLabel, transactions]) => (
            <YStack key={dateLabel} gap={12}>
              {/* Date Header with Total */}
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={14} fontWeight="600" color="$textPrimary">
                  {dateLabel}
                </Text>
                <Text
                  fontSize={14}
                  fontWeight="600"
                  color={getGroupTotal(transactions) >= 0 ? "#0B9E6A" : "$textPrimary"}
                >
                  {getGroupTotal(transactions) >= 0 ? "+ " : "- "}
                  OMR {Math.abs(getGroupTotal(transactions)).toFixed(2)}
                </Text>
              </XStack>

              {/* Transaction Items */}
              <YStack gap={0}>
                {transactions.map((transaction) => (
                  <XStack
                    key={transaction.id}
                    alignItems="center"
                    gap={12}
                    paddingVertical={12}
                    backgroundColor="white"
                    borderRadius={12}
                    marginBottom={8}
                    paddingHorizontal={12}
                  >
                    {/* Icon */}
                    <Circle
                      size={44}
                      backgroundColor={transaction.iconBg}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize={20}>{transaction.icon}</Text>
                    </Circle>

                    {/* Merchant Info */}
                    <YStack flex={1} gap={2}>
                      <Text fontSize={16} fontWeight="600" color="$textPrimary">
                        {transaction.merchant}
                      </Text>
                      <Text fontSize={12} color="$textSecondary">
                        {transaction.category}
                      </Text>
                    </YStack>

                    {/* Amount */}
                    <Text
                      fontSize={16}
                      fontWeight="600"
                      color={transaction.amount >= 0 ? "#0B9E6A" : "#E74C3C"}
                    >
                      {transaction.amount >= 0 ? "+ " : "- "}
                      OMR {Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}

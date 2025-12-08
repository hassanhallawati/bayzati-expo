import { ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Circle, Text, XStack, YStack } from "tamagui";
import AddTransactionSheet from "../../src/components/AddTransactionSheet";
import { formatPeriodForAPI, getGroupedTransactions } from "../../src/services/transactionService";
import type { GroupedTransactionsResponse, Transaction } from "../../src/types/transaction";
import { getMediaBaseURL } from "../../src/utils/media";

export default function Transactions() {
  const insets = useSafeAreaInsets();
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Current month by default
  const [transactions, setTransactions] = useState<GroupedTransactionsResponse>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch transactions when month changes
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const period = formatPeriodForAPI(selectedMonth);
        const data = await getGroupedTransactions(period);
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedMonth]);

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

  const handleTransactionCreated = async () => {
    // Refresh the transaction list after creating a new transaction
    setIsLoading(true);
    setError(null);
    try {
      const period = formatPeriodForAPI(selectedMonth);
      const data = await getGroupedTransactions(period);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionUpdated = async () => {
    // Refresh the transaction list after updating a transaction
    await handleTransactionCreated();
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsAddSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setIsAddSheetOpen(open);
    if (!open) {
      // Clear selected transaction when sheet closes
      setSelectedTransaction(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const period = formatPeriodForAPI(selectedMonth);
      const data = await getGroupedTransactions(period);
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$primaryBg" position="relative">
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
      </YStack>

      {/* Transaction List */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0B3D2E"
            colors={["#0B3D2E"]}
          />
        }
      >
        {isLoading ? (
          <YStack padding={40} alignItems="center" justifyContent="center">
            <ActivityIndicator size="large" color="#0B3D2E" />
            <Text fontSize={14} color="$textSecondary" marginTop={12}>
              Loading transactions...
            </Text>
          </YStack>
        ) : error ? (
          <YStack padding={40} alignItems="center" justifyContent="center">
            <Text fontSize={16} color="$error" textAlign="center">
              {error}
            </Text>
          </YStack>
        ) : transactions.length === 0 ? (
          <YStack padding={40} alignItems="center" justifyContent="center">
            <Text fontSize={16} color="$textSecondary" textAlign="center">
              No transactions for this month
            </Text>
          </YStack>
        ) : (
          <YStack padding={20} gap={24}>
            {transactions.map((group) => (
              <YStack key={group.date} gap={12}>
                {/* Date Header with Total */}
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={14} fontWeight="600" color="$textPrimary">
                    {group.label}
                  </Text>
                  <Text
                    fontSize={14}
                    fontWeight="600"
                    color={group.net_sign === "+" ? "#0B9E6A" : "$textPrimary"}
                  >
                    {group.net_sign} OMR {group.total_amount}
                  </Text>
                </XStack>

                {/* Transaction Items */}
                <YStack gap={0}>
                  {group.transactions.map((transaction) => (
                    <XStack
                      key={transaction.id}
                      alignItems="center"
                      gap={12}
                      paddingVertical={12}
                      backgroundColor="white"
                      borderRadius={12}
                      marginBottom={0}
                      paddingHorizontal={12}
                      onPress={() => handleTransactionClick(transaction)}
                      pressStyle={{ opacity: 0.7 }}
                      cursor="pointer"
                    >
                      {/* Icon */}
                      <Circle
                        size={44}
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                      >
                        <Image
                          source={{ uri: `${getMediaBaseURL()}${transaction.category_icon_round}` }}
                          style={{ width: 44, height: 44 }}
                          resizeMode="cover"
                        />
                      </Circle>

                      {/* Transaction Info */}
                      <YStack flex={1} gap={4}>
                        <Text fontSize={16} fontWeight="600" color="$textPrimary">
                          {transaction.type === "INCOME" ? transaction.subcategory : transaction.merchant}
                        </Text>
                        <Text fontSize={12} color="$textSecondary">
                          {transaction.category}
                        </Text>
                      </YStack>

                      {/* Amount */}
                      <Text
                        fontSize={16}
                        fontWeight="600"
                        color={transaction.color}
                      >
                        {transaction.sign} OMR {transaction.amount}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </YStack>
            ))}
          </YStack>
        )}
      </ScrollView>

      {/* Floating Action Button */}
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
        onPress={() => setIsAddSheetOpen(true)}
      >
        <Plus size={32} color="white" />
      </Circle>

      {/* Add/Edit Transaction Sheet */}
      <AddTransactionSheet
        open={isAddSheetOpen}
        onOpenChange={handleSheetClose}
        transaction={selectedTransaction}
        onTransactionCreated={handleTransactionCreated}
        onTransactionUpdated={handleTransactionUpdated}
      />
    </YStack>
  );
}

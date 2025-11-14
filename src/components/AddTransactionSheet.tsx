import { Calendar, ChevronRight, FileText, Tag, X } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Button, Input, Sheet, Text, XStack, YStack } from "tamagui";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTransactionSheet({ open, onOpenChange }: AddTransactionSheetProps) {
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("Today");
  const [note, setNote] = useState("");

  const handleSave = () => {
    // TODO: Implement save logic
    console.log({
      type: transactionType,
      amount,
      vendor,
      category,
      date,
      note,
    });
    onOpenChange(false);
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
      <Sheet.Handle backgroundColor="$borderColor" />
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
            onPress={() => onOpenChange(false)}
          />
          <Text fontSize={18} fontWeight="600" color="$textPrimary">
            Add Transaction
          </Text>
          <Button
            size="$3"
            chromeless
            onPress={handleSave}
          >
            <Text fontSize={16} fontWeight="600" color="$primaryDeepGreen">
              Save
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
            onPress={() => setTransactionType("EXPENSE")}
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
            onPress={() => setTransactionType("INCOME")}
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
          {/* Add Vendor */}
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
              placeholder="Add Vendor"
              value={vendor}
              onChangeText={setVendor}
              borderWidth={0}
              backgroundColor="transparent"
              fontSize={16}
              color="$textPrimary"
              placeholderTextColor="$textSecondary"
            />
          </XStack>

          {/* Select Category */}
          <XStack
            backgroundColor="white"
            padding={16}
            borderRadius={12}
            alignItems="center"
            gap={12}
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
            onPress={() => {
              // TODO: Open category picker
              console.log("Open category picker");
            }}
          >
            <Tag size={24} color="$primaryDeepGreen" />
            <Text
              flex={1}
              fontSize={16}
              color={category ? "$textPrimary" : "$textSecondary"}
            >
              {category || "Select Category"}
            </Text>
            <ChevronRight size={24} color="$textSecondary" />
          </XStack>

          {/* Date */}
          <XStack
            backgroundColor="white"
            padding={16}
            borderRadius={12}
            alignItems="center"
            gap={12}
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
            onPress={() => {
              // TODO: Open date picker
              console.log("Open date picker");
            }}
          >
            <Calendar size={24} color="$textPrimary" />
            <YStack flex={1}>
              <Text fontSize={16} fontWeight="600" color="$textPrimary">
                Date
              </Text>
              <Text fontSize={14} color="$textSecondary">
                {date}
              </Text>
            </YStack>
            <ChevronRight size={24} color="$textSecondary" />
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
    </Sheet>
  );
}

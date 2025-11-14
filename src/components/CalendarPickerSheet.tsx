import { ChevronLeft, ChevronRight, X } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Button, Sheet, Text, XStack, YStack } from "tamagui";

interface CalendarPickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function CalendarPickerSheet({
  open,
  onOpenChange,
  selectedDate,
  onSelectDate,
}: CalendarPickerSheetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date(selectedDate));

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setTempSelectedDate(newDate);
  };

  const handleSave = () => {
    onSelectDate(tempSelectedDate);
    onOpenChange(false);
  };

  const handleClose = () => {
    // Reset to original selected date on cancel
    setTempSelectedDate(new Date(selectedDate));
    setCurrentMonth(new Date(selectedDate));
    onOpenChange(false);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const daysInPrevMonth = getDaysInMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

    const days: JSX.Element[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <YStack
          key={`prev-${day}`}
          width="14.28%"
          height={40}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize={16} color="$textSecondary" opacity={0.3}>
            {day}
          </Text>
        </YStack>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      dateToCheck.setHours(0, 0, 0, 0);

      const isToday = dateToCheck.getTime() === today.getTime();
      const isSelected =
        tempSelectedDate.getDate() === day &&
        tempSelectedDate.getMonth() === currentMonth.getMonth() &&
        tempSelectedDate.getFullYear() === currentMonth.getFullYear();

      days.push(
        <YStack
          key={`current-${day}`}
          width="14.28%"
          height={40}
          alignItems="center"
          justifyContent="center"
          onPress={() => handleDateClick(day)}
          pressStyle={{ opacity: 0.7 }}
          cursor="pointer"
        >
          {isSelected ? (
            <YStack
              width={40}
              height={40}
              backgroundColor="$primaryGreen"
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={16} color="white" fontWeight="600">
                {day}
              </Text>
            </YStack>
          ) : (
            <Text
              fontSize={16}
              color={isToday ? "$primaryGreen" : "$textPrimary"}
              fontWeight={isToday ? "600" : "400"}
            >
              {day}
            </Text>
          )}
        </YStack>
      );
    }

    // Next month days to fill the grid
    const totalCells = days.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <YStack
          key={`next-${day}`}
          width="14.28%"
          height={40}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize={16} color="$textSecondary" opacity={0.3}>
            {day}
          </Text>
        </YStack>
      );
    }

    return days;
  };

  const formatMonthYear = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[65]}
      dismissOnSnapToBottom
      zIndex={100002}
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
        <YStack flex={1} padding={20}>
          {/* Header */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom={24}
          >
            <Button
              size="$3"
              chromeless
              circular
              icon={<X size={24} color="$textPrimary" />}
              onPress={handleClose}
            />
            <XStack alignItems="center" gap={16}>
              <Button
                size="$3"
                chromeless
                circular
                icon={<ChevronLeft size={20} color="$textPrimary" />}
                onPress={handlePreviousMonth}
                pressStyle={{ opacity: 0.7 }}
              />
              <Text fontSize={18} fontWeight="600" color="$textPrimary" minWidth={150} textAlign="center">
                {formatMonthYear(currentMonth)}
              </Text>
              <Button
                size="$3"
                chromeless
                circular
                icon={<ChevronRight size={20} color="$textPrimary" />}
                onPress={handleNextMonth}
                pressStyle={{ opacity: 0.7 }}
              />
            </XStack>
            <YStack width={40} />
          </XStack>

          {/* Calendar */}
          <YStack gap={8}>
            {/* Day labels */}
            <XStack>
              {daysOfWeek.map((day) => (
                <YStack key={day} width="14.28%" alignItems="center">
                  <Text fontSize={14} color="$textSecondary" fontWeight="500">
                    {day}
                  </Text>
                </YStack>
              ))}
            </XStack>

            {/* Calendar grid */}
            <XStack flexWrap="wrap" marginTop={8}>
              {renderCalendarDays()}
            </XStack>
          </YStack>

          {/* Save Button */}
          <YStack marginTop="auto" paddingTop={24}>
            <Button
              size="$5"
              backgroundColor="$primaryGreen"
              borderRadius={12}
              onPress={handleSave}
              pressStyle={{ opacity: 0.9 }}
            >
              <Text fontSize={16} fontWeight="600" color="white">
                Save
              </Text>
            </Button>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

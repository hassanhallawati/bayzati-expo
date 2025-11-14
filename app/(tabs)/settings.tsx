import { Bell, Copy, Crown, Download, Globe, HelpCircle, Mail, Trash2 } from "@tamagui/lucide-icons";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Circle, Text, XStack, YStack } from "tamagui";
import { useAuth } from "../../src/hooks/useAuth";
import { useRouter } from "expo-router";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // Get user initials for avatar
  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    const name = email.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };

  const handleCopyEmail = () => {
    // TODO: Implement copy to clipboard functionality
    console.log("Copy transaction email");
  };

  return (
    <YStack flex={1} backgroundColor="#F4F4F5">
      {/* Header */}
      <YStack
        backgroundColor="$primaryDeepGreen"
        paddingTop={insets.top + 16}
        paddingBottom={16}
        paddingHorizontal={20}
      >
        <Text fontSize={24} fontWeight="600" color="white" textAlign="center">
          Profile
        </Text>
      </YStack>

      <ScrollView>
        {/* Profile Section */}
        <YStack paddingHorizontal={20} paddingTop={11} paddingBottom={20}>
          <XStack alignItems="center" gap={18}>
            {/* Avatar */}
            <Circle size={67} backgroundColor="$primaryDeepGreen">
              <Text fontSize={32} fontWeight="700" color="white">
                {getInitials(user?.email)}
              </Text>
            </Circle>

            {/* User Info */}
            <YStack flex={1}>
              <Text fontSize={20} fontWeight="600" color="#111827">
                John Doe
              </Text>
              <Text fontSize={14} color="#6B7280" marginTop={2}>
                {user?.email || "hihihihihihih@hotmailhi.com"}
              </Text>
              <Text fontSize={14} color="#6B7280" marginTop={2}>
                Free User
              </Text>
            </YStack>
          </XStack>
        </YStack>

        {/* Transaction Email Section */}
        <YStack marginHorizontal={20} backgroundColor="#FAFAFA" borderRadius={12} padding={20} marginBottom={24}>
          <Text fontSize={18} fontWeight="600" color="#111827" marginBottom={8}>
            Your Transaction Email
          </Text>
          <Text fontSize={14} color="#6B7280" lineHeight={20} marginBottom={16}>
            Forward your transaction emails to this address to automatically add them to your account.
          </Text>
          <XStack
            backgroundColor="#E5E7EB"
            borderRadius={12}
            padding={12}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize={14} color="black">
              transactions.john@bayzati.com
            </Text>
            <Button
              unstyled
              padding={0}
              onPress={handleCopyEmail}
              pressStyle={{ opacity: 0.7 }}
            >
              <Copy size={16} color="#111827" />
            </Button>
          </XStack>
        </YStack>

        {/* Settings Section */}
        <YStack paddingHorizontal={20} marginBottom={40}>
          <Text fontSize={18} fontWeight="600" color="#111827" marginBottom={16}>
            Settings
          </Text>

          {/* Settings Grid - Row 1 */}
          <XStack gap={16} marginBottom={16}>
            {/* Premium Card */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="#FDF2C4">
                <Crown size={18} color="#D4AF37" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="#D4AF37">
                  Premium
                </Text>
                <Text fontSize={12} color="black" marginTop={4}>
                  Unlock full features
                </Text>
              </YStack>
            </YStack>

            {/* Notifications Card */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="$primaryDeepGreen">
                <Bell size={14} color="white" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="black">
                  Notifications
                </Text>
                <Text fontSize={12} color="black" marginTop={4}>
                  Manage alerts
                </Text>
              </YStack>
            </YStack>
          </XStack>

          {/* Settings Grid - Row 2 */}
          <XStack gap={16} marginBottom={16}>
            {/* Automate Expenses Card */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="$primaryDeepGreen">
                <Mail size={17} color="white" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="black">
                  Automate Expenses
                </Text>
                <Text fontSize={12} color="black" marginTop={4} lineHeight={16}>
                  Manage automated expense tracking
                </Text>
              </YStack>
            </YStack>

            {/* Language & Currency Card */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="$primaryDeepGreen">
                <Globe size={16} color="white" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="black">
                  Language & Currency
                </Text>
                <Text fontSize={12} color="black" marginTop={4} lineHeight={16}>
                  Choose app language and primary currency
                </Text>
              </YStack>
            </YStack>
          </XStack>

          {/* Settings Grid - Row 3 */}
          <XStack gap={16} marginBottom={16}>
            {/* Export Data Card */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="$primaryDeepGreen">
                <Download size={16} color="white" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="black">
                  Export Data
                </Text>
                <Text fontSize={12} color="black" marginTop={4}>
                  Download transactions
                </Text>
              </YStack>
            </YStack>

            {/* Reset App Card */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="$primaryDeepGreen">
                <Trash2 size={14} color="white" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="black">
                  Reset App
                </Text>
                <Text fontSize={12} color="black" marginTop={4}>
                  Clear user data
                </Text>
              </YStack>
            </YStack>
          </XStack>

          {/* Settings Grid - Row 4 */}
          <XStack gap={16}>
            {/* Help & Support Card */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="$primaryDeepGreen">
                <HelpCircle size={16} color="white" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="black">
                  Help & Support
                </Text>
                <Text fontSize={12} color="black" marginTop={4} lineHeight={16}>
                  Access support resources
                </Text>
              </YStack>
            </YStack>

            {/* Logout Card */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
              onPress={handleLogout}
              pressStyle={{ opacity: 0.7 }}
              cursor="pointer"
            >
              <Circle size={40} backgroundColor="#ef4444">
                <Text fontSize={16} color="white">→</Text>
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="black">
                  Logout
                </Text>
                <Text fontSize={12} color="black" marginTop={4}>
                  Sign out of account
                </Text>
              </YStack>
            </YStack>
          </XStack>
        </YStack>

        {/* App Version Footer */}
        <YStack alignItems="center" paddingBottom={20}>
          <Text fontSize={12} color="#9CA3AF" textAlign="center">
            App Version v1.2.3 (tap to view release notes)
          </Text>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

import { Bell, Copy, Crown, Download, Globe, HelpCircle, Mail, Trash2 } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Circle, Text, XStack, YStack } from "tamagui";
import ComingSoonSheet from "../../src/components/ComingSoonSheet";
import { useAuth } from "../../src/hooks/useAuth";
import { getEmailInbox } from "../../src/services/accountService";
import { getUserProfile } from "../../src/services/authService";
import type { EmailInbox } from "../../src/types/account";
import type { UserProfile } from "../../src/types/auth";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [emailInbox, setEmailInbox] = useState<EmailInbox | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, inbox] = await Promise.all([
          getUserProfile(),
          getEmailInbox(),
        ]);
        setUserProfile(profile);
        setEmailInbox(inbox);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // Get display name from profile
  const getDisplayName = () => {
    if (!userProfile) return "";
    const fullName = `${userProfile.first_name} ${userProfile.last_name}`.trim();
    if (fullName) return fullName;
    // Fallback: parse email before @
    return userProfile.email.split("@")[0];
  };

  // Get user initials for avatar
  const getInitials = () => {
    const displayName = getDisplayName();
    if (!displayName) return "U";
    return displayName.substring(0, 2).toUpperCase();
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
                {getInitials()}
              </Text>
            </Circle>

            {/* User Info */}
            <YStack flex={1}>
              <Text fontSize={20} fontWeight="600" color="#111827">
                {getDisplayName()}
              </Text>
              <Text fontSize={14} color="#6B7280" marginTop={2}>
                {userProfile?.email || ""}
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
            gap={8}
          >
            <Text
              flex={1}
              fontSize={12}
              color="black"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {emailInbox?.email_address || ""}
            </Text>
            <Button
              unstyled
              padding={4}
              onPress={handleCopyEmail}
              pressStyle={{ opacity: 0.7 }}
            >
              <Copy size={18} color="#111827" />
            </Button>
          </XStack>
        </YStack>

        {/* Settings Section */}
        <YStack paddingHorizontal={20} marginBottom={40}>
          <Text fontSize={18} fontWeight="600" color="#111827" marginBottom={16}>
            Settings
          </Text>

          {/* Settings Grid - Row 1: Help & Support and Logout */}
          <XStack gap={16} marginBottom={16}>
            {/* Help & Support Card */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
              onPress={() => setShowComingSoon(true)}
              pressStyle={{ opacity: 0.7 }}
              cursor="pointer"
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

          {/* Settings Grid - Row 2: Premium and Notifications (Disabled) */}
          <XStack gap={16} marginBottom={16}>
            {/* Premium Card - Disabled */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="#E5E7EB">
                <Crown size={18} color="#9CA3AF" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="#9CA3AF">
                  Premium
                </Text>
                <Text fontSize={12} color="#9CA3AF" marginTop={4}>
                  Coming soon
                </Text>
              </YStack>
            </YStack>

            {/* Notifications Card - Disabled */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="#E5E7EB">
                <Bell size={14} color="#9CA3AF" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="#9CA3AF">
                  Notifications
                </Text>
                <Text fontSize={12} color="#9CA3AF" marginTop={4}>
                  Coming soon
                </Text>
              </YStack>
            </YStack>
          </XStack>

          {/* Settings Grid - Row 3: Automate Expenses and Language & Currency (Disabled) */}
          <XStack gap={16} marginBottom={16}>
            {/* Automate Expenses Card - Disabled */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="#E5E7EB">
                <Mail size={17} color="#9CA3AF" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="#9CA3AF">
                  Automate Expenses
                </Text>
                <Text fontSize={12} color="#9CA3AF" marginTop={4} lineHeight={16}>
                  Coming soon
                </Text>
              </YStack>
            </YStack>

            {/* Language & Currency Card - Disabled */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="#E5E7EB">
                <Globe size={16} color="#9CA3AF" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="#9CA3AF">
                  Language & Currency
                </Text>
                <Text fontSize={12} color="#9CA3AF" marginTop={4} lineHeight={16}>
                  Coming soon
                </Text>
              </YStack>
            </YStack>
          </XStack>

          {/* Settings Grid - Row 4: Export Data and Reset App (Disabled) */}
          <XStack gap={16}>
            {/* Export Data Card - Disabled */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="#E5E7EB">
                <Download size={16} color="#9CA3AF" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="#9CA3AF">
                  Export Data
                </Text>
                <Text fontSize={12} color="#9CA3AF" marginTop={4}>
                  Coming soon
                </Text>
              </YStack>
            </YStack>

            {/* Reset App Card - Disabled */}
            <YStack
              flex={1}
              backgroundColor="#FAFAFA"
              borderRadius={12}
              padding={16}
              gap={12}
            >
              <Circle size={40} backgroundColor="#E5E7EB">
                <Trash2 size={14} color="#9CA3AF" />
              </Circle>
              <YStack>
                <Text fontSize={12} fontWeight="600" color="#9CA3AF">
                  Reset App
                </Text>
                <Text fontSize={12} color="#9CA3AF" marginTop={4}>
                  Coming soon
                </Text>
              </YStack>
            </YStack>
          </XStack>
        </YStack>

        {/* App Version Footer */}
        <YStack alignItems="center" paddingBottom={20}>
          <Text fontSize={12} color="#9CA3AF" textAlign="center">
            App Version v1.0.2 Beta
          </Text>
        </YStack>
      </ScrollView>

      {/* Coming Soon Sheet */}
      <ComingSoonSheet
        open={showComingSoon}
        onOpenChange={setShowComingSoon}
        description={"For assistance during Beta, contact us at support@bayzati.com"}
      />
    </YStack>
  );
}

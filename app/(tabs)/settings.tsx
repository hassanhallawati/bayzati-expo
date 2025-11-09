import { Button, H1, Text, YStack } from "tamagui";
import { useAuth } from "../../src/hooks/useAuth";
import { useRouter } from "expo-router";

export default function Settings() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <YStack
      flex={1}
      backgroundColor="$primaryBg"
      padding="$6"
      justifyContent="center"
      alignItems="center"
      gap="$4"
    >
      <H1 color="$primaryDeepGreen">Settings</H1>

      <Text fontSize={16} color="$textPrimary">
        {user?.email}
      </Text>

      <Text fontSize={14} color="$textSecondary" textAlign="center">
        Manage your account settings here.
      </Text>

      <Button
        backgroundColor="$error"
        color="$white"
        height={46}
        borderRadius="$3"
        fontSize={16}
        fontWeight="500"
        marginTop="$4"
        pressStyle={{
          opacity: 0.8,
        }}
        onPress={handleLogout}
      >
        Logout
      </Button>
    </YStack>
  );
}

import { Button, H1, Text, YStack } from "tamagui";
import { useAuth } from "../src/hooks/useAuth";
import { useRouter } from "expo-router";

export default function Dashboard() {
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
      <H1 color="$primaryDeepGreen">Dashboard</H1>

      <Text fontSize={16} color="$textPrimary">
        Welcome{user?.email ? `, ${user.email}` : ""}!
      </Text>

      <Text fontSize={14} color="$textSecondary" textAlign="center">
        Your expense tracker dashboard will be built here.
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

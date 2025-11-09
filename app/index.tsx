import { Redirect } from "expo-router";
import { useAuth } from "../src/hooks/useAuth";

export default function Index() {
  const { isAuthenticated } = useAuth();

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}

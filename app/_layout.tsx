import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { useColorScheme } from "react-native";
import tamaguiConfig from "../tamagui.config";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === "dark" ? "dark" : "light"}>
      <Stack screenOptions={{ headerShown: false }} />
    </TamaguiProvider>
  );
}

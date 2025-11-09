import { Tabs } from "expo-router";
import { Home, Receipt, Gem, BarChart3, Settings } from "@tamagui/lucide-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0B3D2E",
        tabBarInactiveTintColor: "#A5A2AA",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 67,
          paddingBottom: 12,
          paddingTop: 12,
          paddingLeft: 16,
          paddingRight: 16,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, size }) => <Receipt size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: "Savings",
          tabBarIcon: ({ color, size }) => <Gem size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

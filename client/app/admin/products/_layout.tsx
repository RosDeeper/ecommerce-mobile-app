import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { COLORS } from "@/constants";

export default function ProductsLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: COLORS.primary,
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Manage Products", headerShown: false }} />
        <Stack.Screen name="add" options={{ title: "Add Product", headerShown: false }} />
        <Stack.Screen name="edit/[id]" options={{ title: "Edit Product", headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
};

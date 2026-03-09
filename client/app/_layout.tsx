import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from "react-native-toast-message";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

import '@/global.css';

/**
 * App root layout that composes gesture handling, safe-area context, cart and wishlist providers, navigation stack, and global toast UI.
 *
 * Renders the top-level React element that supplies gesture handling and safe-area insets to the app, wraps screens with cart and wishlist context, includes the navigation stack (headers hidden), and mounts the toast notification container.
 *
 * @returns A JSX element representing the application's root layout including providers, navigation stack, and toast container.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CartProvider>
          <WishlistProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
          </WishlistProvider>
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

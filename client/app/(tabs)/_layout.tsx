import { Tabs } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { View } from "react-native";

import { COLORS } from "@/constants";
import { useCart } from "@/context/CartContext";

const TabLayout = () => {
  const { cartItems } = useCart();

  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#cdcdc0',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 64,
          paddingTop: 6,
        }
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={26}
            />
          )
        }}
      />
      <Tabs.Screen 
        name="cart"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="relative">
              <Feather 
                name={focused ? 'shopping-cart' : 'shopping-cart'}
                color={color}
                size={26}
              />

              {cartItems?.length > 0 && (
                <View className="absolute -top-2 -right-2 bg-accent size-3 rounded-full items-center justify-center">
                  <Ionicons name='ellipse' size={6} color='white' />
                </View>
              )}

            </View>
          )
        }}
      />
      <Tabs.Screen 
        name="favourites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'heart' : 'heart-outline'}
              color={color}
              size={26}
            />
          )
        }}
      />
      <Tabs.Screen 
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={26}
            />
          )
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

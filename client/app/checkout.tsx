/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";

import { useCart } from "@/context/CartContext";
import { Address } from "@/constants/types";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import api from "@/constants/api";

const Checkout = () => {
  const router = useRouter();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [pageloading, setPageLoading] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'stripe'>('cash');

  const { cartTotal, clearCart } = useCart();

  const shipping = 2.0;
  const tax = 0;
  const total = cartTotal + shipping + tax;

  const fetchAddress = async () => {
    try {
      const token = await getToken();

      const { data } = await api.get('/address', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const addrList = data.data;
      
      if (addrList.length > 0) {
        // Find default or first
        const def = addrList.find((a: Address) => a.isDefault) || addrList[0];

        setSelectedAddress(def);
      }

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch addresses',
        text2: error.response?.data?.message || 'Something went wrong'
      });
    } finally {
      setPageLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please add a shipping address'
      });
      return;
    }

    if (paymentMethod === 'stripe') {
      return Toast.show({
        type: 'error',
        text1: 'Info',
        text2: 'Stripe not implemented yet'
      });
    }
    
    setLoading(true);

    try {
      const payload = {
        shippingAddress: selectedAddress,
        notes: 'Placed via App',
        paymentMethod: 'cash',
      };

      const token = await getToken();

      const { data } = await api.post('/order', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        await clearCart();

        Toast.show({
          type: 'success',
          text1: 'Order Placed',
          text2: 'Your order has been placed!'
        });

        router.replace('/orders');
      }

    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Failed to place order',
        text2: error.response?.data?.message || 'Something went wrong'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  if (pageloading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size='large' color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <Header title="Checkout" showBack />

      <ScrollView className="flex-1 px-4 mt-4">
        {/* Address */}
        <Text className="text-lg font-bold text-primary mb-4">
          Shipping Address
        </Text>
        {selectedAddress ? (
          <View className="bg-white p-4 rounded-xl mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-bold">{selectedAddress.type}</Text>

              <TouchableOpacity onPress={() => router.push('/addresses')}>
                <Text className="text-accent text-sm">Change</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-secondary leading-5">
              {selectedAddress.street}, {selectedAddress.city}
              {'\n'}
              {selectedAddress.state}, {selectedAddress.zipCode}
              {'\n'}
              {selectedAddress.country}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push('/addresses')}
            className="bg-white p-6 rounded-xl mb-6 items-center justify-center border-dashed border-2 border-gray-100"
          >
            <Text className="font-bold text-primary">Add Address</Text>
          </TouchableOpacity>
        )}

        {/* Payment */}
        <Text className="text-lg font-bold text-primary mb-4">Payment Method</Text>

        {/* Cash on Delivery */}
        <TouchableOpacity 
          className={`
            bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2
            ${paymentMethod === 'cash' ? 'border-primary' : 'border-transparent'}
          `}
          onPress={() => setPaymentMethod('cash')}
        >
          <Ionicons name='cash-outline' size={24} color={COLORS.primary} className="mr-3" />

          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">Cash on Delivery</Text>
            <Text className="text-xs text-secondary mt-1">Pay when you receive the order</Text>
          </View>

          {paymentMethod === 'cash' && (
            <Ionicons name='checkmark-circle' size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>

        {/* Stripe */}
        <TouchableOpacity 
          className={`
            bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2
            ${paymentMethod === 'stripe' ? 'border-primary' : 'border-transparent'}
          `}
          onPress={() => setPaymentMethod('stripe')}
        >
          <Ionicons name='card-outline' size={24} color={COLORS.primary} className="mr-3" />

          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">Pay with Card</Text>
            <Text className="text-xs text-secondary mt-1">Credit or Debit Card</Text>
          </View>

          {paymentMethod === 'stripe' && (
            <Ionicons name='checkmark-circle' size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Order summary */}
      <View className="p-4 bg-white shadow-lg border-t border-gray-100">
        <Text className="text-lg font-bold text-primary mb-4">Order Summary</Text>

        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Subtotal</Text>
          <Text className="font-bold">${cartTotal.toFixed(2)}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Shipping</Text>
          <Text className="font-bold">${shipping.toFixed(2)}</Text>
        </View>

        <View className="flex-row justify-between mb-4">
          <Text className="text-secondary">Tax</Text>
          <Text className="font-bold">${tax.toFixed(2)}</Text>
        </View>

        <View className="flex-row justify-between mb-6">
          <Text className="text-primary text-xl font-bold">Total</Text>
          <Text className="text-primary text-xl font-bold">${total.toFixed(2)}</Text>
        </View>

        {/* Place Order */}
        <TouchableOpacity
          className={`
            p-4 rounded-xl items-center mb-3
            ${loading ? 'bg-gray-400' : 'bg-primary'}
          `}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text className="text-white font-bold text-lg">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Checkout;

/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/expo";

import { Product } from "@/constants/types";
import api from "@/constants/api";
import Toast from "react-native-toast-message";

export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  price: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartTotal: number;
  itemCount: number;
  loading: boolean;
  addToCart: (product: Product, size: string) => Promise<void>;
  removeFromCart: (itemId: string, size: string) => Promise<void>;
  updateQuantity: (itemId: string, size: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) =>{
  const { getToken, isSignedIn } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartTotal, setCartTotal] = useState<number>(0);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const { data } = await api.get('/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && data. data) {
        const serverCart = data.data;
        const mappedItems: CartItem[] = serverCart.items.map((item: any) => {
          return {
            id: item.product._id,
            productId: item.product._id,
            product: item.product,
            quantity: item.quantity,
            size: item?.size || 'M',
            price: item.price,
          };
        });

        setCartItems(mappedItems);
        setCartTotal(serverCart.totalAmount);
      }
      
    } catch (error) {
      console.error('Failed to fetch cart: ', error);
    } finally{
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, size: string) => {
    if (!isSignedIn) {
      return Toast.show({
        type: 'error',
        text1: 'Please login to add to cart',
      });
    }

    try {
      setLoading(true);
      
      const token = await getToken();
      const { data } = await api.post(
        '/cart/add', 
        {
          productId: product._id,
          quantity: 1,
          size
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        await fetchCart();
      }

    } catch (error) {
      console.error('Failed to add to cart: ', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to add to cart',
      });
      
    } finally{
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string, size: string) => {
    if (!isSignedIn) return;
    
    try {
      setLoading(true);
      
      const token = await getToken();
      const { data } = await api.delete(
        `/cart/item/${itemId}?size=${size}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        await fetchCart();
      }

    } catch (error) {
      console.error('Failed to remove to cart: ', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to remove to cart',
      });

    } finally{
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, size: string, quantity: number) => {
    if (!isSignedIn) return;
    if (quantity < 1) return;


    try {
      setLoading(true);
      
      const token = await getToken();
      const { data } = await api.put(
        `/cart/item/${itemId}`,
        { quantity, size }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        await fetchCart();
      }

    } catch (error) {
      console.error('Failed to update quantity: ', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to update quantity',
      });

    } finally{
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isSignedIn) return;

    try {
      setLoading(true);
      
      const token = await getToken();
      const { data } = await api.delete(
        `/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setCartItems([]);
        setCartTotal(0);
      }

    } catch (error) {
      console.error('Failed to clear cart: ', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to clear cart',
      });

    } finally{
      setLoading(false);
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (isSignedIn) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
    }

  }, [isSignedIn]);

  return (
    <CartContext.Provider value={{ 
      cartItems, cartTotal, itemCount, loading,
      addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

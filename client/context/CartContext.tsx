import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { Product } from "@/constants/types";
import { dummyCart } from "@/assets/assets";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartTotal, setCartTotal] = useState<number>(0);

  const fetchCart = async () => {
    setLoading(true);

    const serverCart = dummyCart
    const mappedItems: CartItem[] = serverCart.items.map((item: any) => {
      return {
        id: item._id,
        productId: item.product._id,
        product: item.product,
        quantity: item.quantity,
        size: item?.size || 'M',
        price: item.price,
      };
    });

    setCartItems(mappedItems);
    setCartTotal(serverCart.totalAmount);
    setLoading(false);
  };

  const addToCart = async (product: Product, size: string) => {};

  const removeFromCart = async (itemId: string, size: string) => {};

  const updateQuantity = async (itemId: string, size: string, quantity: number) => {};

  const clearCart = async () => {};

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetchCart();
  }, []);

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

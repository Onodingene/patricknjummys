import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface CartItem {
  id?: number; // Make id optional for new items
  productId: number;
  quantity: number;
  price: number;
  customDetails: {
    title: string;
    description: string;
    tags: string[];
    notes?: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  calculateTotal: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", { withCredentials: true });
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      await axios.post("http://localhost:5000/api/cart/add", item, { withCredentials: true });
      fetchCart(); // Refetch to get the new item with its id
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, { withCredentials: true });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotal = () => cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, calculateTotal }}>
      {children}
    </CartContext.Provider>
  );
};
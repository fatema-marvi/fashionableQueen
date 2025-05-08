"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedSize: string;
  selectedColor: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  grandTotal: number;
  deliveryCharge: number;
  addToCart: (item: CartItem) => void;
  updateQuantity: (
    productId: string,
    selectedSize: string,
    selectedColor: string,
    quantity: number
  ) => void;
  removeFromCart: (
    productId: string,
    selectedSize: string,
    selectedColor: string
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes (even if empty)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.productId === newItem.productId &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === newItem.productId &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      return [...prevCart, newItem];
    });
  };

  const updateQuantity = (
    productId: string,
    selectedSize: string,
    selectedColor: string,
    quantity: number
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeFromCart = (
    productId: string,
    selectedSize: string,
    selectedColor: string
  ) => {
    const updatedCart = cart.filter(
      (item) =>
        item.productId !== productId ||
        item.selectedSize !== selectedSize ||
        item.selectedColor !== selectedColor
    );
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const deliveryCharge = 0;
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const grandTotal = subtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        grandTotal,
        deliveryCharge,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

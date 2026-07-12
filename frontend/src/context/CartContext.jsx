import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "gamestore_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(game) {
    setItems((prev) => {
      if (prev.some((g) => g._id === game._id)) return prev;
      return [...prev, game];
    });
  }

  function removeFromCart(gameId) {
    setItems((prev) => prev.filter((g) => g._id !== gameId));
  }

  function clearCart() {
    setItems([]);
  }

  const value = { items, addToCart, removeFromCart, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
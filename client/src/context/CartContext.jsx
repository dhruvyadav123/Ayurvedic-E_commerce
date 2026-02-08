// context/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existing = cartItems.find((p) => p._id === product._id);
    if (existing) {
      setCartItems(
        cartItems.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((p) => p._id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCartItems(cartItems.map((p) => (p._id === id ? { ...p, qty } : p)));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

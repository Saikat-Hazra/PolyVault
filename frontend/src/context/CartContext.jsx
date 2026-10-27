import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCartItems(res.data || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (assetId, licenseTier) => {
    await api.post(`/cart/${assetId}`, { licenseTier });
    await fetchCart();
  };

  const updateTier = async (assetId, licenseTier) => {
    await api.patch(`/cart/${assetId}`, { licenseTier });
    await fetchCart();
  };

  const removeFromCart = async (assetId) => {
    await api.delete(`/cart/${assetId}`);
    await fetchCart();
  };

  const clearCart = () => setCartItems([]);

  // Derived state (PRD mandate: never stored)
  const itemCount = cartItems.length;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      itemCount,
      subtotal,
      loading,
      addToCart,
      updateTier,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    try {
      const { data } = await api.get("/cart");
      setItems(data);
    } catch {}
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product_id, quantity = 1) => {
    if (!user) { toast.error("Please log in to add items"); return; }
    try {
      await api.post("/cart", { product_id, quantity });
      toast.success("Added to cart ✓");
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      await api.put(`/cart/${id}`, { quantity });
      fetchCart();
    } catch {}
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } catch {}
  };

  const clearCart = async () => {
    try { await api.delete("/cart/clear"); setItems([]); } catch {}
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

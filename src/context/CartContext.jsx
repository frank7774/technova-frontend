import { createContext, useContext, useEffect, useState } from 'react';
const CartContext = createContext();
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => { const saved = localStorage.getItem('technova-cart'); return saved ? JSON.parse(saved) : []; });
  useEffect(() => { localStorage.setItem('technova-cart', JSON.stringify(cart)); }, [cart]);
  const addItem = (producto) => { setCart((prev) => { const existe = prev.find((p) => p.id === producto.id); if (existe) return prev.map((p) => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p); return [...prev, { ...producto, cantidad: 1 }]; }); };
  const removeItem = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const updateCantidad = (id, cantidad) => { setCart((prev) => prev.map((p) => p.id === id ? { ...p, cantidad: Number(cantidad) } : p)); };
  const clearCart = () => setCart([]);
  const total = cart.reduce((acc, item) => { const precioFinal = item.precio * (1 - (item.descuento || 0) / 100); return acc + precioFinal * item.cantidad; }, 0);
  return <CartContext.Provider value={{ cart, addItem, removeItem, updateCantidad, clearCart, total }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
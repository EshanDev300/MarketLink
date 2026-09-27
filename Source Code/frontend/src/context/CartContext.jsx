import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('marketlink_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('marketlink_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product._id);
      if (existingIndex > -1) {
        const copy = [...prev];
        const newQty = copy[existingIndex].quantity + quantity;
        copy[existingIndex].quantity = Math.min(newQty, product.stock_quantity || product.stockQuantity || 99);
        return copy;
      } else {
        return [...prev, {
          productId: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          quantity: Math.min(quantity, product.stock_quantity || product.stockQuantity || 99),
          image: product.image,
          farmerId: product.farmerId || product.farmer,
          farmerName: product.farmerName || 'Local Farmer',
          marketId: product.marketId || '',
          stallName: product.stallName || 'Farm Stall'
        }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Group items by farmer for separate orders if needed
  const farmerId = cartItems.length > 0 ? cartItems[0].farmerId : null;
  const farmerName = cartItems.length > 0 ? cartItems[0].farmerName : null;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      totalAmount,
      totalItemsCount,
      farmerId,
      farmerName
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

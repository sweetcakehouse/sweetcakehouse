import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { settings } = useSettings();
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sweet_cake_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('sweet_cake_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = ({
    product,
    weight = '1 kg',
    price,
    flavor = 'Classic',
    isEggless = true,
    cakeMessage = '',
    quantity = 1,
  }) => {
    setCart((prevCart) => {
      // Build a unique key for grouping identical configurations
      const itemKey = `${product._id || product.id}-${weight}-${flavor}-${isEggless}-${cakeMessage.trim()}`;

      const existingIndex = prevCart.findIndex((item) => item.itemKey === itemKey);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem = {
        itemKey,
        id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        product: product._id || product.id,
        slug: product.slug,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        weight,
        price: Number(price) || product.price || 499,
        flavor,
        isEggless,
        cakeMessage: cakeMessage.trim(),
        quantity: Math.max(1, quantity),
      };

      return [...prevCart, newItem];
    });
  };

  // Update item quantity
  const updateQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.itemKey === itemKey ? { ...item, quantity } : item))
    );
  };

  // Remove item
  const removeFromCart = (itemKey) => {
    setCart((prev) => prev.filter((item) => item.itemKey !== itemKey));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryCharge =
    subtotal === 0
      ? 0
      : settings.freeDeliveryAbove && subtotal >= settings.freeDeliveryAbove
      ? 0
      : settings.deliveryCharge || 50;

  const totalAmount = subtotal + deliveryCharge;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryCharge,
        totalAmount,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);


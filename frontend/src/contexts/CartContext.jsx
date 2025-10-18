import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState(null);

    const fetchCartCount = useCallback(async () => {
        try {
            const response = await apiClient.get('/carts');
            const totalItems = response.data?.items 
                ? response.data.items.reduce((count, item) => count + item.amount, 0) 
                : 0;
            setCartCount(totalItems);
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartCount(0);
            setCart({ items: [] });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshCartCount = useCallback(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    const addToCart = useCallback(async (productId, amount = 1) => {
        try {
            await apiClient.post('/carts/items', { productId, amount });
            refreshCartCount(); // Refresh after adding
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }, [refreshCartCount]);

    const updateCartItem = useCallback(async (productId, amount) => {
        try {
            const response = await apiClient.patch(`/carts/items/${productId}`, { amount });
            setCart(response.data);
            refreshCartCount(); // Refresh after updating
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    }, [refreshCartCount]);

    const removeFromCart = useCallback(async (productId) => {
        try {
            const response = await apiClient.delete(`/carts/items/${productId}`);
            setCart(response.data);
            refreshCartCount(); // Refresh after removing
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }, [refreshCartCount]);

    const checkout = useCallback(async () => {
        try {
            await apiClient.post('/orders');
            refreshCartCount(); // Refresh after checkout
        } catch (error) {
            console.error('Error during checkout:', error);
            throw error;
        }
    }, [refreshCartCount]);

    useEffect(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    const value = {
        cartCount,
        isLoading,
        cart,
        refreshCartCount,
        addToCart,
        updateCartItem,
        removeFromCart,
        checkout
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

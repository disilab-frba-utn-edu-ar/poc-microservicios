import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuth0 } from '@auth0/auth0-react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [isLoadingCart, setIsLoadingCart] = useState(true);
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth0();

    const fetchCart = useCallback(async () => {
        if (!isAuthLoading && isAuthenticated) {
            setIsLoadingCart(true);
            try {
                console.log('Fetching cart...'); // Log
                const response = await apiClient.get('/carts');
                setCart(response.data || { items: [] });
                console.log('Cart fetched:', response.data);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
                setCart({ items: [] });
            } finally {
                setIsLoadingCart(false);
            }
        } else if (!isAuthLoading && !isAuthenticated) {
            setCart(null);
            setIsLoadingCart(false);
        }
    }, [isAuthenticated, isAuthLoading]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = useCallback(async (productId, amount = 1) => {
        if (!isAuthenticated) return false;
        try {
            const response = await apiClient.post('/carts/items', { productId, amount });
            setCart(response.data);
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }, [isAuthenticated]);

    const updateCartItem = useCallback(async (productId, amount) => {
        if (!isAuthenticated) return false;
        try {
            const response = await apiClient.patch(`/carts/items/${productId}`, { amount });
            setCart(response.data);
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    }, [isAuthenticated]);

    // Function to remove item
    const removeFromCart = useCallback(async (productId) => {
        if (!isAuthenticated) return false;
        try {
            const response = await apiClient.delete(`/carts/items/${productId}`);
            setCart(response.data);
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }, [isAuthenticated]);

    const clearLocalCart = useCallback(() => {
        setCart(null);
    }, []);

    const checkout = useCallback(async () => {
        if (!isAuthenticated) {
            throw new Error("User not authenticated.");
        }

        try {
            const checkoutPayload = {
                successUrl: `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}/cart`
            };
            const response = await apiClient.post('/orders', checkoutPayload);

            if (response.data && response.data.description && !response.data.id) {
                console.warn("Checkout fallback response received:", response.data.description);
                throw new Error(response.data.description);
            }
            else if (response.data && response.data.id) {
                // Do not clear the cart locally immediately; Webhook will do it.
                // We will optimistically clear it on the success page instead.
                return response.data;
            }
            else {
                console.error("Unexpected checkout response:", response.data);
                throw new Error("An unexpected error occurred during checkout.");
            }
        } catch (error) {
            console.error('Error during checkout API call:', error);
            throw error;
        }
    }, [isAuthenticated]);

    const cartCount = cart?.items ? cart.items.reduce((count, item) => count + item.amount, 0) : 0;

    const value = {
        cart,
        cartCount,
        isLoading: isLoadingCart,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        checkout,
        clearLocalCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
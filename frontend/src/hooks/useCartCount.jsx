import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';

export const useCartCount = () => {
    const [cartCount, setCartCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCartCount = useCallback(async () => {
        try {
            const response = await apiClient.get('/carts');
            const totalItems = response.data?.items 
                ? response.data.items.reduce((count, item) => count + item.amount, 0) 
                : 0;
            setCartCount(totalItems);
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartCount(0);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    const refreshCartCount = useCallback(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    return { cartCount, isLoading, refreshCartCount };
};

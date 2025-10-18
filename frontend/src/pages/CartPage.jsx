import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const CartItemRow = ({ item, onUpdate, onDelete, apiBaseUrl }) => {
    const [currentQuantity, setCurrentQuantity] = useState(item.amount);
    const [isSaving, setIsSaving] = useState(false);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        setCurrentQuantity(value >= 1 ? value : 1);
    };

    const handleSaveClick = async () => {
        if (currentQuantity === item.amount) return;
        setIsSaving(true);
        await onUpdate(item.productId, currentQuantity);
        setIsSaving(false);
    };

    const handleDeleteClick = async () => {
        setIsSaving(true);
        await onDelete(item.productId);
    };

    useEffect(() => {
        setCurrentQuantity(item.amount);
    }, [item.amount]);

    return (
        <div className="flex flex-col sm:flex-row items-center border-b py-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <img src={`${apiBaseUrl}${item.imageUrl}`} alt={item.productName} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow text-center sm:text-left">
                <h2 className="font-semibold text-lg">{item.productName}</h2>
                <p className="text-gray-600">${item.priceAtTimeOfAdd.toFixed(2)} (each)</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-gray-700 w-8 text-center">{currentQuantity} x</span>
                <input
                    type="number"
                    value={currentQuantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="1"
                    disabled={isSaving}
                />
                {currentQuantity !== item.amount && (
                    <button
                        onClick={handleSaveClick}
                        className={`px-3 py-1 text-sm rounded-md text-white ${isSaving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition`}
                        disabled={isSaving}
                    >
                        {isSaving ? '...' : 'Save'}
                    </button>
                )}
                <button
                    onClick={handleDeleteClick}
                    className={`px-3 py-1 text-sm rounded-md text-white ${isSaving ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-700'} transition`}
                    disabled={isSaving}
                >
                    {isSaving ? '...' : 'Remove'}
                </button>
            </div>
        </div>
    );
};


const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/carts');
            setCart(response.data);
        } catch (error) {
            toast.error('Could not fetch your cart.');
            setCart({ items: [] });
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleUpdateQuantity = async (productId, amount) => {
        const updatePromise = apiClient.patch(`/carts/items/${productId}`, { amount });
        toast.promise(
            updatePromise,
            { pending: 'Updating quantity...', success: 'Quantity updated!', error: 'Update failed.' }
        );
        try {
            const response = await updatePromise;
            setCart(response.data);
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleDeleteItem = async (productId) => {
        const deletePromise = apiClient.delete(`/carts/items/${productId}`);
        toast.promise(
            deletePromise,
            { pending: 'Removing item...', success: 'Item removed!', error: 'Failed to remove item.' }
        );
        try {
            const response = await deletePromise;
            setCart(response.data);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleCheckout = async () => {
        await toast.promise(
            apiClient.post('/orders'),
            {
                pending: 'Placing your order...',
                success: 'Order placed successfully!',
                error: 'Order failed. Please try again.'
            }
        );
        fetchCart();
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const totalItemCount = cart?.items ? cart.items.reduce((count, item) => count + item.amount, 0) : 0; // Use 'amount'
    const totalCartPrice = cart?.items ? cart.items.reduce((sum, item) => sum + (item.priceAtTimeOfAdd * item.amount), 0) : 0; // Use 'amount'

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
                {totalItemCount > 0 && (
                    <span className="text-lg text-gray-600">
                        ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
                    </span>
                )}
            </div>

            {cart && cart.items.length > 0 ? (
                <div>
                    {cart.items.map(item => (
                        <CartItemRow
                            key={item.productId}
                            item={item}
                            onUpdate={handleUpdateQuantity}
                            onDelete={handleDeleteItem}
                            apiBaseUrl={API_BASE_URL}
                        />
                    ))}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <Link to="/" className="text-blue-600 hover:underline">
                            &larr; Continue Shopping
                        </Link>
                        <div className="text-right">
                            <p className="text-xl font-semibold mb-2">Total: ${totalCartPrice.toFixed(2)}</p>
                            <button onClick={handleCheckout} className="bg-green-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition">
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-600 text-lg">Your cart is empty.</p>
                    <Link to="/" className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                        Continue Shopping
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CartPage;